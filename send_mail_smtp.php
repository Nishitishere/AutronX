<?php
/**
 * Enhanced Email Solution using PHPMailer with SMTP
 * This provides better deliverability than basic PHP mail()
 * 
 * Setup Instructions:
 * 1. Download PHPMailer: https://github.com/PHPMailer/PHPMailer
 * 2. Extract to: public_html/PHPMailer/
 * 3. Configure Gmail App Password below
 * 4. Update send_mail.php to use this file instead
 */

// Uncomment these lines after installing PHPMailer
// require 'PHPMailer/src/Exception.php';
// require 'PHPMailer/src/PHPMailer.php';
// require 'PHPMailer/src/SMTP.php';

// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get POST data
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($_POST['subject'] ?? 'AutronX Panel Design');
$message = htmlspecialchars($_POST['message'] ?? '');
$additional_message = htmlspecialchars($_POST['additional_message'] ?? '');

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email']);
    exit();
}

/* 
// Uncomment after installing PHPMailer
$mail = new PHPMailer(true);

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';  // Gmail SMTP
    $mail->SMTPAuth   = true;
    $mail->Username   = 'your-email@gmail.com';  // Your Gmail
    $mail->Password   = 'your-app-password';      // Gmail App Password (not regular password!)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('noreply@autronx.com', 'AutronX Panel Builder');
    $mail->addAddress($email);                    // User's email
    $mail->addAddress('info@autronx.com');        // Company email
    $mail->addReplyTo($email);

    // Content
    $mail->isHTML(false);
    $mail->Subject = $subject;
    $mail->Body    = "AutronX Panel Design Request\n\n";
    $mail->Body   .= "Customer Email: " . $email . "\n\n";
    $mail->Body   .= "Panel Details:\n" . $message . "\n\n";
    
    if (!empty($additional_message)) {
        $mail->Body .= "Additional Message:\n" . $additional_message . "\n\n";
    }
    
    $mail->Body .= "\n---\n";
    $mail->Body .= "Date: " . date('Y-m-d H:i:s') . "\n";

    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Email failed: ' . $mail->ErrorInfo
    ]);
}
*/

// Temporary fallback to basic mail() until PHPMailer is installed
$emailBody = "AutronX Panel Design Request\n\n";
$emailBody .= "Customer Email: " . $email . "\n\n";
$emailBody .= "Panel Details:\n" . $message . "\n\n";
if (!empty($additional_message)) {
    $emailBody .= "Additional Message:\n" . $additional_message . "\n\n";
}
$emailBody .= "\n---\nDate: " . date('Y-m-d H:i:s') . "\n";

$headers = "From: AutronX <noreply@autronx.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

if (mail($email . ', info@autronx.com', $subject, $emailBody, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Email sent']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Email failed']);
}
?>
