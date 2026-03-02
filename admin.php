<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mail_config.php';
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$hasAnnouncementsArchivedColumn = true;
try {
    $pdo->query("SELECT archived FROM announcements LIMIT 1");
} catch (\Throwable $e) {
    $hasAnnouncementsArchivedColumn = false;
}

// Attempt a lightweight auto-migration for archive support (safe to fail silently)
if (!$hasAnnouncementsArchivedColumn) {
    try {
        $pdo->exec("ALTER TABLE announcements ADD COLUMN archived TINYINT(1) NOT NULL DEFAULT 0");
        $hasAnnouncementsArchivedColumn = true;
    } catch (\Throwable $e) {
        $hasAnnouncementsArchivedColumn = false;
    }
}

function sendProcessedAppointmentEmail(string $email, string $name, string $date, string $purpose): void
{
    global $adminEmail, $gmailAppPassword;

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return;
    }

    $subject = 'Barangay Appointment Approved';
    $body = "Hi {$name},\n\n"
        . "Your booking on {$date} ({$purpose}) has been successfully approved.\n"
        . "Please be at the barangay office on that day.\n\n"
        . "Thank you,\nBarangay Bonbon";

    try {
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $adminEmail;
        $mail->Password = $gmailAppPassword;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom($adminEmail, 'Barangay Bonbon');
        $mail->addAddress($email, $name);

        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
    } catch (Exception $e) {
        // silently fail for now
    }
}

function sendProcessedAppointmentSms(string $phone, string $name, string $date, string $purpose): void
{
    $apiUrl = ''; // Fill with your SMS provider URL
    $apiKey = ''; // Fill with your SMS provider API key

    if (!$apiUrl || !$apiKey) {
        return;
    }

    $message = "Hi {$name}, your booking on {$date} ({$purpose}) has been approved. Please be at the barangay office on that day.";

    $payload = [
        'to' => $phone,
        'message' => $message,
        'api_key' => $apiKey,
    ];

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_exec($ch);
    curl_close($ch);
}

// handle status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    $status = $_POST['status'];
    $reason = trim($_POST['reason']);
    $return_date = $_POST['return_date'] ?: null;

    $stmt = $pdo->prepare("INSERT INTO captain_status (status, reason, return_date) VALUES (?, ?, ?)");
    $stmt->execute([$status, $reason, $return_date]);
    $status_message = 'Captain status updated.';
}

// handle new announcement
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['post_announcement'])) {
    $title = trim($_POST['title']);
    $body = trim($_POST['body']);
    if ($title && $body) {
        $stmt = $pdo->prepare("INSERT INTO announcements (title, body) VALUES (?, ?)");
        $stmt->execute([$title, $body]);
        $announcement_message = 'Announcement posted.';
    } else {
        $announcement_message = 'Title and body are required.';
    }
}

// handle archive/unarchive/delete announcement
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['announcement_action'])) {
    $action = $_POST['announcement_action'];
    $id = (int)($_POST['announcement_id'] ?? 0);

    if ($id > 0) {
        if ($action === 'delete') {
            $stmt = $pdo->prepare("DELETE FROM announcements WHERE id = ?");
            $stmt->execute([$id]);
            $announcement_message = 'Announcement deleted.';
        } elseif (($action === 'archive' || $action === 'unarchive') && $hasAnnouncementsArchivedColumn) {
            $archived = $action === 'archive' ? 1 : 0;
            $stmt = $pdo->prepare("UPDATE announcements SET archived = ? WHERE id = ?");
            $stmt->execute([$archived, $id]);
            $announcement_message = $archived ? 'Announcement archived.' : 'Announcement restored.';
        }
    }
}

// handle marking appointment processed
if (isset($_POST['mark_processed'])) {
    $id = (int)$_POST['appointment_id'];

    $stmt = $pdo->prepare("SELECT * FROM appointments WHERE id = ?");
    $stmt->execute([$id]);
    $appt = $stmt->fetch();

    if ($appt && !$appt['processed']) {
        $update = $pdo->prepare("UPDATE appointments SET processed = 1 WHERE id = ?");
        $update->execute([$id]);

        $name = $appt['name'];
        $email = $appt['email'] ?? '';
        $phone = $appt['phone'];
        $date = $appt['appointment_date'];
        $purpose = $appt['purpose'];

        sendProcessedAppointmentEmail($email, $name, $date, $purpose);
        sendProcessedAppointmentSms($phone, $name, $date, $purpose);
    }
}

// fetch appointments log (deduplicated by key fields for display)
$apptStmt = $pdo->query("SELECT * FROM appointments ORDER BY created_at DESC");
$rawAppointments = $apptStmt->fetchAll();

$appointments = [];
$seenAppointmentKeys = [];
foreach ($rawAppointments as $appt) {
    $keyParts = [
        strtolower(trim($appt['name'] ?? '')),
        trim($appt['phone'] ?? ''),
        strtolower(trim($appt['purpose'] ?? '')),
        trim($appt['appointment_date'] ?? ''),
        (int)($appt['processed'] ?? 0),
    ];
    $key = implode('|', $keyParts);

    if (isset($seenAppointmentKeys[$key])) {
        continue;
    }

    $seenAppointmentKeys[$key] = true;
    $appointments[] = $appt;
}

// fetch announcements lists
if ($hasAnnouncementsArchivedColumn) {
    $annActiveStmt = $pdo->query("SELECT * FROM announcements WHERE archived = 0 ORDER BY created_at DESC");
    $activeAnnouncements = $annActiveStmt->fetchAll();

    $annArchivedStmt = $pdo->query("SELECT * FROM announcements WHERE archived = 1 ORDER BY created_at DESC");
    $archivedAnnouncements = $annArchivedStmt->fetchAll();
} else {
    $annActiveStmt = $pdo->query("SELECT * FROM announcements ORDER BY created_at DESC");
    $activeAnnouncements = $annActiveStmt->fetchAll();
    $archivedAnnouncements = [];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin – Barangay Bonbon System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<div class="admin-wrap">
    <aside class="admin-sidebar">
        <div class="brand">Barangay Bonbon System</div>
        <nav class="nav flex-column" id="admin-nav">
            <a class="nav-link active" href="admin.php#dashboard" data-section="dashboard">Dashboard</a>
            <a class="nav-link" href="admin.php#announcements" data-section="announcements">Past Announcements</a>
            <a class="nav-link" href="admin.php#appointments" data-section="appointments">Appointment Manager</a>
            <a class="nav-link" href="admin.php#captain" data-section="captain">Captain's Status</a>
            <a class="nav-link" href="admin.php#profile" data-section="profile">Profile &amp; Settings</a>
            <a class="nav-link" href="index.php">Back to Public Site</a>
        </nav>
    </aside>

    <main class="admin-main">
        <div class="admin-header d-flex justify-content-between align-items-center" id="dashboard">
            <h1>Dashboard Overview</h1>
        </div>

        <!-- Captain status -->
        <div class="admin-card" id="captain">
            <div class="card-header">Captain's Current Status</div>
            <div class="card-body">
                <?php if (!empty($status_message)): ?>
                    <div class="alert alert-info py-2 mb-3"><?= htmlspecialchars($status_message) ?></div>
                <?php endif; ?>
                <form method="post">
                    <input type="hidden" name="update_status" value="1">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label" for="status">Status</label>
                            <select id="status" name="status" class="form-select" required>
                                <option value="On-Duty">On-Duty</option>
                                <option value="Out of Office">Out of Office</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="reason">Reason (if out)</label>
                            <input type="text" id="reason" name="reason" class="form-control" placeholder="e.g. Cebu City for Barangay League">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="return_date">Return Date</label>
                            <input type="date" id="return_date" name="return_date" class="form-control">
                        </div>
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary btn-edit-status">Edit Status</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Appointments -->
        <div class="admin-card" id="appointments">
            <div class="card-header">Appointment Summary</div>
            <div class="card-body">
                <!-- Pending appointments -->
                <h6 class="mb-2">Pending Appointments</h6>
                <div class="table-responsive mb-3">
                    <table class="table admin-table mb-0">
                        <thead>
                            <tr>
                                <th>Resident Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Purpose</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $hasPending = false;
                            foreach ($appointments as $appt):
                                if ($appt['processed']) {
                                    continue;
                                }
                                $hasPending = true;
                            ?>
                                <tr>
                                    <td><?= htmlspecialchars($appt['name']) ?></td>
                                    <td><?= htmlspecialchars($appt['email'] ?? '—') ?></td>
                                    <td><?= htmlspecialchars($appt['phone']) ?></td>
                                    <td><?= htmlspecialchars($appt['purpose']) ?></td>
                                    <td><?= htmlspecialchars($appt['appointment_date']) ?></td>
                                    <td>
                                        <span class="badge rounded-pill badge-pending">Pending</span>
                                    </td>
                                    <td>
                                        <form method="post" class="d-inline">
                                            <input type="hidden" name="mark_processed" value="1">
                                            <input type="hidden" name="appointment_id" value="<?= $appt['id'] ?>">
                                            <button type="submit" class="btn btn-sm btn-success">Approve</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            <?php if (!$hasPending): ?>
                                <tr>
                                    <td colspan="7" class="text-muted text-center">No pending appointments.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

                <!-- Completed appointments -->
                <h6 class="mb-2">Completed Appointments</h6>
                <div class="table-responsive">
                    <table class="table admin-table mb-0">
                        <thead>
                            <tr>
                                <th>Resident Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Purpose</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $hasCompleted = false;
                            foreach ($appointments as $appt):
                                if (!$appt['processed']) {
                                    continue;
                                }
                                $hasCompleted = true;
                            ?>
                                <tr>
                                    <td><?= htmlspecialchars($appt['name']) ?></td>
                                    <td><?= htmlspecialchars($appt['email'] ?? '—') ?></td>
                                    <td><?= htmlspecialchars($appt['phone']) ?></td>
                                    <td><?= htmlspecialchars($appt['purpose']) ?></td>
                                    <td><?= htmlspecialchars($appt['appointment_date']) ?></td>
                                    <td>
                                        <span class="badge rounded-pill badge-confirmed">Confirmed</span>
                                    </td>
                                    <td>
                                        <span class="text-muted">Done</span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            <?php if (!$hasCompleted): ?>
                                <tr>
                                    <td colspan="7" class="text-muted text-center">No completed appointments yet.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Post announcement -->
        <div class="admin-card" id="announcements">
            <div class="card-header">Recent Announcements / Post New</div>
            <div class="card-body">
                <?php if (!empty($announcement_message)): ?>
                    <div class="alert alert-info py-2 mb-3"><?= htmlspecialchars($announcement_message) ?></div>
                <?php endif; ?>

                <h6 class="text-muted mb-2">Past Announcements</h6>
                <?php if (!empty($activeAnnouncements)): ?>
                    <div class="list-group mb-4">
                        <?php foreach ($activeAnnouncements as $ann): ?>
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                                    <div>
                                        <div class="fw-semibold"><?= htmlspecialchars($ann['title']) ?></div>
                                        <div class="small text-muted">Posted <?= htmlspecialchars($ann['created_at']) ?></div>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <?php if ($hasAnnouncementsArchivedColumn): ?>
                                            <form method="post" class="d-inline">
                                                <input type="hidden" name="announcement_action" value="archive">
                                                <input type="hidden" name="announcement_id" value="<?= (int)$ann['id'] ?>">
                                                <button type="submit" class="btn btn-sm btn-outline-primary">Archive</button>
                                            </form>
                                        <?php endif; ?>
                                        <form method="post" class="d-inline" onsubmit="return confirm('Delete this announcement?');">
                                            <input type="hidden" name="announcement_action" value="delete">
                                            <input type="hidden" name="announcement_id" value="<?= (int)$ann['id'] ?>">
                                            <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                        </form>
                                    </div>
                                </div>
                                <details class="mt-2">
                                    <summary class="small text-muted">View message</summary>
                                    <div class="small text-muted mt-2"><?= nl2br(htmlspecialchars($ann['body'])) ?></div>
                                </details>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <p class="text-muted mb-4">No announcements yet.</p>
                <?php endif; ?>

                <?php if ($hasAnnouncementsArchivedColumn): ?>
                    <h6 class="text-muted mb-2">Archived</h6>
                    <?php if (!empty($archivedAnnouncements)): ?>
                        <div class="list-group mb-4">
                            <?php foreach ($archivedAnnouncements as $ann): ?>
                                <div class="list-group-item">
                                    <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                                        <div>
                                            <div class="fw-semibold"><?= htmlspecialchars($ann['title']) ?></div>
                                            <div class="small text-muted">Posted <?= htmlspecialchars($ann['created_at']) ?></div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2">
                                            <form method="post" class="d-inline">
                                                <input type="hidden" name="announcement_action" value="unarchive">
                                                <input type="hidden" name="announcement_id" value="<?= (int)$ann['id'] ?>">
                                                <button type="submit" class="btn btn-sm btn-outline-secondary">Restore</button>
                                            </form>
                                            <form method="post" class="d-inline" onsubmit="return confirm('Delete this announcement?');">
                                                <input type="hidden" name="announcement_action" value="delete">
                                                <input type="hidden" name="announcement_id" value="<?= (int)$ann['id'] ?>">
                                                <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                            </form>
                                        </div>
                                    </div>
                                    <details class="mt-2">
                                        <summary class="small text-muted">View message</summary>
                                        <div class="small text-muted mt-2"><?= nl2br(htmlspecialchars($ann['body'])) ?></div>
                                    </details>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <p class="text-muted mb-4">No archived announcements.</p>
                    <?php endif; ?>
                <?php endif; ?>

                <form method="post">
                    <input type="hidden" name="post_announcement" value="1">
                    <div class="mb-3">
                        <label class="form-label" for="title">Title</label>
                        <input type="text" id="title" name="title" class="form-control" placeholder="e.g. Free Anti-Rabies Vaccine Saturday!" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="body">Body</label>
                        <textarea id="body" name="body" class="form-control" rows="4" placeholder="Announcement details..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Post Announcement</button>
                </form>
            </div>
        </div>

        <!-- Profile & Settings -->
        <div class="admin-card" id="profile">
            <div class="card-header">Profile &amp; Settings</div>
            <div class="card-body">
                <h6 class="text-muted mb-3">Admin account</h6>
                <div class="mb-4">
                    <label class="form-label small text-muted">Notification email (Gmail)</label>
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <input type="text" class="form-control form-control-sm" style="max-width: 280px;" value="Hidden for privacy" readonly>
                    </div>
                    <p class="small text-muted mt-2 mb-0">This address is used to send appointment approval emails. It is stored in <code>mail_config.php</code> and is not shown to residents.</p>
                </div>
                <hr>
                <h6 class="text-muted mb-2">Privacy</h6>
                <ul class="small text-muted mb-0">
                    <li>Your admin Gmail is used only for sending notifications from this system.</li>
                    <li>Resident emails in Appointment Manager are visible only to admins and are not shared publicly.</li>
                    <li>To change the notification email or app password, edit <code>mail_config.php</code> on the server.</li>
                </ul>
            </div>
        </div>
    </main>
</div>
<script>
(function() {
    var nav = document.getElementById('admin-nav');
    var scrollContainer = document.querySelector('.admin-main');
    if (!nav || !scrollContainer) return;
    var sectionIds = ['dashboard', 'captain', 'appointments', 'announcements', 'profile'];
    var offset = 120;

    function setActiveSection() {
        var activeId = null;
        for (var i = sectionIds.length - 1; i >= 0; i--) {
            var el = document.getElementById(sectionIds[i]);
            if (!el) continue;
            var rect = el.getBoundingClientRect();
            if (rect.top <= offset) {
                activeId = sectionIds[i];
                break;
            }
        }
        if (!activeId) activeId = sectionIds[0];

        nav.querySelectorAll('.nav-link[data-section]').forEach(function(link) {
            if (link.getAttribute('data-section') === activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    scrollContainer.addEventListener('scroll', function() { setActiveSection(); }, { passive: true });
    window.addEventListener('load', function() {
        if (window.location.hash) setActiveSection();
        setActiveSection();
    });
    setActiveSection();
})();
</script>
</body>
</html>