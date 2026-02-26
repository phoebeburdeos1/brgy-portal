<?php
require_once __DIR__ . '/db.php';

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

// handle marking appointment processed
if (isset($_POST['mark_processed'])) {
    $id = (int)$_POST['appointment_id'];
    $stmt = $pdo->prepare("UPDATE appointments SET processed = 1 WHERE id = ?");
    $stmt->execute([$id]);
}

// fetch appointments log
$apptStmt = $pdo->query("SELECT * FROM appointments ORDER BY created_at DESC");
$appointments = $apptStmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin - BRGY Bonbon System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
        <a class="navbar-brand" href="index.php">BRGY Bonbon System</a>
        <a class="nav-link text-white" href="admin.php">Admin</a>
    </div>
</nav>

<div class="container my-4">
    <h1 class="mb-4">Administrative Dashboard</h1>

    <!-- status controller -->
    <section class="mb-5">
        <h2>Update Captain Status</h2>
        <?php if (!empty($status_message)): ?>
            <div class="alert alert-info"><?= htmlspecialchars($status_message) ?></div>
        <?php endif; ?>
        <form method="post" class="row gy-3">
            <input type="hidden" name="update_status" value="1">
            <div class="col-md-4">
                <label class="form-label" for="status">Status</label>
                <select id="status" name="status" class="form-select" required>
                    <option value="On-Duty">On-Duty</option>
                    <option value="Out of Office">Out of Office</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label" for="reason">Reason (if out)</label>
                <input type="text" id="reason" name="reason" class="form-control">
            </div>
            <div class="col-md-4">
                <label class="form-label" for="return_date">Return Date</label>
                <input type="date" id="return_date" name="return_date" class="form-control">
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </section>

    <!-- announcement manager -->
    <section class="mb-5">
        <h2>Post Announcement</h2>
        <?php if (!empty($announcement_message)): ?>
            <div class="alert alert-info"><?= htmlspecialchars($announcement_message) ?></div>
        <?php endif; ?>
        <form method="post">
            <input type="hidden" name="post_announcement" value="1">
            <div class="mb-3">
                <label class="form-label" for="title">Title</label>
                <input type="text" id="title" name="title" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label" for="body">Body</label>
                <textarea id="body" name="body" class="form-control" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Post</button>
        </form>
    </section>

    <!-- appointment log -->
    <section>
        <h2>Appointment Log</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Processed</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($appointments as $appt): ?>
                    <tr>
                        <td><?= htmlspecialchars($appt['name']) ?></td>
                        <td><?= htmlspecialchars($appt['phone']) ?></td>
                        <td><?= nl2br(htmlspecialchars($appt['purpose'])) ?></td>
                        <td><?= htmlspecialchars($appt['appointment_date']) ?></td>
                        <td><?= $appt['processed'] ? 'Yes' : 'No' ?></td>
                        <td>
                            <?php if (!$appt['processed']): ?>
                                <form method="post" class="d-inline">
                                    <input type="hidden" name="mark_processed" value="1">
                                    <input type="hidden" name="appointment_id" value="<?= $appt['id'] ?>">
                                    <button class="btn btn-sm btn-success">Mark as Processed</button>
                                </form>
                            <?php else: ?>
                                <span class="text-muted">--</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </section>
</div>

<footer class="bg-primary text-white text-center py-3">
    <div class="container">
        &copy; <?= date('Y') ?> Barangay Connect
    </div>
</footer>
</body>
</html>