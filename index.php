<?php
// Public dashboard for Barangay Connect
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mail_config.php';
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendAppointmentEmail(string $email, string $name, string $phone, string $date, string $purpose): void
{
    global $adminEmail, $gmailAppPassword;

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return;
    }

    $subject = 'Barangay Appointment Confirmation';
    $body = "Hi {$name},\n\n"
        . "Your appointment request has been received.\n"
        . "Date: {$date}\n"
        . "Purpose: {$purpose}\n\n"
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
        // also send a copy to the admin
        $mail->addBCC($adminEmail);

        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
    } catch (Exception $e) {
        // silently fail for now
    }
}

function sendAppointmentSms(string $phone, string $name, string $date, string $purpose): void
{
    $apiUrl = ''; // Fill with your SMS provider URL
    $apiKey = ''; // Fill with your SMS provider API key

    if (!$apiUrl || !$apiKey) {
        return;
    }

    $message = "Hi {$name}, your barangay appointment on {$date} has been received. Purpose: {$purpose}";

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

// fetch current captain status
$statusStmt = $pdo->query("SELECT * FROM captain_status ORDER BY id DESC LIMIT 1");
$captain = $statusStmt->fetch();

// handle appointment submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_appointment'])) {
    if ($captain && $captain['status'] === 'On-Duty') {
        $message = 'Online appointment requests are disabled while the captain is On-Duty. Please visit the barangay office directly.';
    } else {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $purpose = trim($_POST['purpose'] ?? '');
    $date = $_POST['appointment_date'] ?? '';

    $errors = [];

    if ($name === '') {
        $errors[] = 'Name is required.';
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'A valid email is required.';
    }

    if ($phone === '') {
        $errors[] = 'Phone number is required.';
    } elseif (!preg_match('/^[0-9+\-\s]+$/', $phone)) {
        $errors[] = 'Phone number must contain only digits and +, -, or spaces.';
    }

    if ($purpose === '') {
        $errors[] = 'Purpose is required.';
    }

    if ($date === '') {
        $errors[] = 'Appointment date is required.';
    }

        if (empty($errors)) {
            $stmt = $pdo->prepare("INSERT INTO appointments (name, email, phone, purpose, appointment_date) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$name, $email, $phone, $purpose, $date]);

            sendAppointmentEmail($email, $name, $phone, $date, $purpose);
            sendAppointmentSms($phone, $name, $date, $purpose);

            $message = 'Your appointment request has been sent. A confirmation will be sent to your email and phone.';
        } else {
            $message = implode(' ', $errors);
        }
    }
}

// fetch announcements
$hasAnnouncementsArchivedColumn = true;
try {
    $pdo->query("SELECT archived FROM announcements LIMIT 1");
} catch (\Throwable $e) {
    $hasAnnouncementsArchivedColumn = false;
}

if ($hasAnnouncementsArchivedColumn) {
    $annStmt = $pdo->query("SELECT * FROM announcements WHERE archived = 0 ORDER BY created_at DESC LIMIT 5");
} else {
    $annStmt = $pdo->query("SELECT * FROM announcements ORDER BY created_at DESC LIMIT 5");
}
$announcements = $annStmt->fetchAll();

$bookingDisabled = $captain && $captain['status'] === 'On-Duty';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Barangay Bonbon System – BRGY Bonbon</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.php">
            <span class="brand-icon">B</span>
            Barangay Bonbon System
        </a>
    </div>
</nav>

<div class="container my-4">
    <div class="row g-4">
        <!-- Left column: Captain status + Announcements -->
        <div class="col-lg-6">
            <?php if ($captain): ?>
                <div class="card captain-status-card <?= $captain['status'] === 'On-Duty' ? 'on-duty' : 'out' ?> mb-4">
                    <div class="card-body">
                        <?php if ($captain['status'] === 'On-Duty'): ?>
                            <h5 class="mb-0">Captain Burdeos: On-Duty</h5>
                            <p class="mb-0 mt-1 opacity-90">Available at the office.</p>
                        <?php else: ?>
                            <h5 class="mb-1">Captain Burdeos: Out of Office</h5>
                            <p class="mb-0">Reason: <?= htmlspecialchars($captain['reason'] ?: '—') ?></p>
                            <?php if ($captain['return_date']): ?>
                                <p class="return-date mb-0 mt-1">Expected back: <?= htmlspecialchars($captain['return_date']) ?></p>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endif; ?>

            <h2 class="section-title">Official Announcements</h2>
            <?php if ($announcements): ?>
                <?php foreach ($announcements as $ann): ?>
                    <div class="card announcement-card mb-3">
                        <div class="card-body">
                            <h5 class="card-title"><?= htmlspecialchars($ann['title']) ?></h5>
                            <p class="card-text text-muted small mb-0"><?= nl2br(htmlspecialchars($ann['body'])) ?></p>
                            <small class="text-muted">Posted <?= $ann['created_at'] ?></small>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p class="text-muted">No announcements yet.</p>
            <?php endif; ?>
        </div>

        <!-- Right column: Book appointment -->
        <div class="col-lg-6">
            <div class="card booking-card">
                <div class="card-body p-4">
                    <h2 class="section-title mb-3">Book an Appointment</h2>
                    <?php if (!empty($message)): ?>
                        <div class="alert alert-info py-2"><?= htmlspecialchars($message) ?></div>
                    <?php endif; ?>
                    <?php if ($bookingDisabled): ?>
                        <p class="text-muted small mb-3">
                            Online booking is temporarily unavailable while the captain is On-Duty. Please visit the barangay office for assistance.
                        </p>
                    <?php endif; ?>
                    <form method="post">
                        <div class="mb-3">
                            <label class="form-label" for="name">Name</label>
                            <input type="text" id="name" name="name" class="form-control" placeholder="Full name" required <?= $bookingDisabled ? 'disabled' : '' ?>>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="email">Email</label>
                            <input type="email" id="email" name="email" class="form-control" placeholder="your@email.com" required <?= $bookingDisabled ? 'disabled' : '' ?>>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="phone">Phone Number</label>
                            <input type="text" id="phone" name="phone" class="form-control" placeholder="09XX XXX XXXX" required <?= $bookingDisabled ? 'disabled' : '' ?>>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="purpose">Purpose</label>
                            <textarea id="purpose" name="purpose" class="form-control" rows="3" placeholder="e.g. Document request, Certificate" required <?= $bookingDisabled ? 'disabled' : '' ?>></textarea>
                        </div>
                        <div class="mb-4">
                            <label class="form-label" for="appointment_date">Date</label>
                            <input type="date" id="appointment_date" name="appointment_date" class="form-control" required <?= $bookingDisabled ? 'disabled' : '' ?>>
                        </div>
                        <button type="submit" name="submit_appointment" class="btn btn-primary btn-schedule" <?= $bookingDisabled ? 'disabled' : '' ?>>Schedule Now</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<footer class="bg-primary text-white text-center py-3 mt-4">
    <div class="container">
        &copy; <?= date('Y') ?> Barangay Connect
    </div>
</footer>
</body>
</html>