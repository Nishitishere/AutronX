<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get POST data
$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? htmlspecialchars($_POST['subject']) : 'AutronX Panel Design';
$message = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';
$additional_message = isset($_POST['additional_message']) ? htmlspecialchars($_POST['additional_message']) : '';

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// Email configuration
$to = $email . ', info@autronx.com'; // Send to user and company
$from = 'noreply@autronx.com'; // Change this to your domain email
$fromName = 'AutronX Panel Builder';

// Build email body
$emailBody = "AutronX Panel Design Request\n\n";
$emailBody .= "Customer Email: " . $email . "\n\n";

if (!empty($message)) {
    $emailBody .= "Panel Details:\n";
    $emailBody .= $message . "\n\n";
}

if (!empty($additional_message)) {
    $emailBody .= "Additional Message:\n";
    $emailBody .= $additional_message . "\n\n";
}

$emailBody .= "\n---\n";
$emailBody .= "This email was sent from AutronX Panel Builder\n";
$emailBody .= "Date: " . date('Y-m-d H:i:s') . "\n";

// Email headers
$headers = "From: " . $fromName . " <" . $from . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mailSent = mail($to, $subject, $emailBody, $headers);

// Return response
if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please try again later.'
    ]);
}
?>
