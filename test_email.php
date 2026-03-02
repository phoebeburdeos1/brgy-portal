<?php
/**
 * One-click test: sends one email to the admin address.
 * Open http://localhost:8000/test_email.php to verify real-time email delivery.
 */
require_once __DIR__ . '/mail_config.php';
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: text/plain; charset=utf-8');

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
    $mail->addAddress($adminEmail);

    $mail->isHTML(false);
    $mail->Subject = 'Barangay test';
    $mail->Body = "If you get this, real-time email works.";

    $mail->send();

    echo "Sent. Check {$adminEmail} inbox.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
