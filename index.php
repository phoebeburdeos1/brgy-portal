<?php
// Public dashboard for Barangay Connect
require_once __DIR__ . '/db.php';

// handle appointment submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_appointment'])) {
    $name = trim($_POST['name']);
    $phone = trim($_POST['phone']);
    $purpose = trim($_POST['purpose']);
    $date = $_POST['appointment_date'];

    if ($name && $phone && $purpose && $date) {
        $stmt = $pdo->prepare("INSERT INTO appointments (name, phone, purpose, appointment_date) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $phone, $purpose, $date]);
        $message = 'Your appointment request has been sent. Thank you!';
    } else {
        $message = 'Please fill in all fields.';
    }
}

// fetch current captain status
$statusStmt = $pdo->query("SELECT * FROM captain_status ORDER BY id DESC LIMIT 1");
$captain = $statusStmt->fetch();

// fetch announcements
$annStmt = $pdo->query("SELECT * FROM announcements ORDER BY created_at DESC LIMIT 5");
$announcements = $annStmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>BRGY Bonbon System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-light">
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
        <a class="navbar-brand" href="index.php">BRGY Bonbon System</a>
    </div>
</nav>

<div class="container my-4">
    <!-- captain status -->
    <?php if ($captain): ?>
        <?php if ($captain['status'] === 'On-Duty'): ?>
            <div class="alert alert-success text-center">
                <h4>Captain is On-Duty</h4>
            </div>
        <?php else: ?>
            <div class="alert alert-danger">
                <h4>Out of Office</h4>
                <p><strong>KAPITAN PHOEBE BURDEOS IS NOT HERE</strong></p>
                <p>Reason: <?= htmlspecialchars($captain['reason']) ?></p>
                <?php if ($captain['return_date']): ?>
                    <p>Return date: <?= htmlspecialchars($captain['return_date']) ?></p>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    <?php endif; ?>

    <!-- announcements -->
    <section class="mb-5">
        <h2>Announcements</h2>
        <?php if ($announcements): ?>
            <?php foreach ($announcements as $ann): ?>
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title"><?= htmlspecialchars($ann['title']) ?></h5>
                        <p class="card-text"><?= nl2br(htmlspecialchars($ann['body'])) ?></p>
                        <small class="text-muted">Posted on <?= $ann['created_at'] ?></small>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p>No announcements yet.</p>
        <?php endif; ?>
    </section>

    <!-- appointment form -->
    <section class="mb-5">
        <h2>Schedule an Appointment</h2>
        <?php if (!empty($message)): ?>
            <div class="alert alert-info"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>
        <form method="post">
            <div class="mb-3">
                <label class="form-label" for="name">Name</label>
                <input type="text" id="name" name="name" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label" for="phone">Phone Number</label>
                <input type="text" id="phone" name="phone" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label" for="purpose">Purpose</label>
                <textarea id="purpose" name="purpose" class="form-control" rows="3" required></textarea>
            </div>
            <div class="mb-3">
                <label class="form-label" for="appointment_date">Date</label>
                <input type="date" id="appointment_date" name="appointment_date" class="form-control" required>
            </div>
            <button type="submit" name="submit_appointment" class="btn btn-primary">Submit</button>
        </form>
    </section>
</div>

<footer class="bg-primary text-white text-center py-3">
    <div class="container">
        &copy; <?= date('Y') ?> Barangay Connect
    </div>
</footer>
</body>
</html>