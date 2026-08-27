<?php
/**
 * Email Test Script for AutronX
 * Access: http://yourdomain.com/test_email.php
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutronX Email Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .status {
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 16px;
            line-height: 1.6;
        }
        .success {
            background: #d4edda;
            border: 2px solid #28a745;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            border: 2px solid #dc3545;
            color: #721c24;
        }
        .info {
            background: #d1ecf1;
            border: 2px solid #17a2b8;
            color: #0c5460;
        }
        .test-form {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        input[type="email"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #667eea;
            border-radius: 6px;
            font-size: 16px;
            margin: 10px 0;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        .details {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 14px;
        }
        .details strong {
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 AutronX Email Test</h1>
        <p>Test your PHP email configuration</p>

        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['test_email'])) {
            $test_email = filter_var($_POST['test_email'], FILTER_SANITIZE_EMAIL);
            
            if (!filter_var($test_email, FILTER_VALIDATE_EMAIL)) {
                echo '<div class="status error">❌ Invalid email address!</div>';
            } else {
                $to = $test_email . ', info@autronx.com';
                $subject = "AutronX Email Test - " . date('Y-m-d H:i:s');
                $message = "This is a test email from AutronX Panel Builder.\n\n";
                $message .= "If you receive this email, your PHP mail() function is working correctly!\n\n";
                $message .= "Test Details:\n";
                $message .= "- Sent to: " . $test_email . " and info@autronx.com\n";
                $message .= "- Date: " . date('Y-m-d H:i:s') . "\n";
                $message .= "- Server: " . $_SERVER['SERVER_NAME'] . "\n";
                $message .= "- PHP Version: " . phpversion() . "\n\n";
                $message .= "---\nAutronX Panel Builder";
                
                $headers = "From: AutronX <noreply@autronx.com>\r\n";
                $headers .= "Reply-To: info@autronx.com\r\n";
                $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
                
                if (mail($to, $subject, $message, $headers)) {
                    echo '<div class="status success">';
                    echo '✅ <strong>Email sent successfully!</strong><br><br>';
                    echo 'Check your inbox (and spam folder) at:<br>';
                    echo '• ' . htmlspecialchars($test_email) . '<br>';
                    echo '• info@autronx.com<br><br>';
                    echo 'Both recipients should receive the email.';
                    echo '</div>';
                } else {
                    echo '<div class="status error">';
                    echo '❌ <strong>Email failed to send!</strong><br><br>';
                    echo 'Possible reasons:<br>';
                    echo '• PHP mail() function is disabled on your hosting<br>';
                    echo '• SMTP settings are not configured<br>';
                    echo '• Your hosting provider blocks outgoing emails<br><br>';
                    echo 'Contact your hosting provider for assistance.';
                    echo '</div>';
                }
            }
        }
        ?>

        <div class="test-form">
            <h3>Send Test Email</h3>
            <form method="POST">
                <label for="test_email">Enter your email address:</label>
                <input type="email" id="test_email" name="test_email" placeholder="your-email@example.com" required>
                <button type="submit">Send Test Email</button>
            </form>
            <p style="margin-top: 15px; color: #666; font-size: 14px;">
                The email will be sent to both your email and info@autronx.com
            </p>
        </div>

        <div class="details">
            <h3>System Information</h3>
            <p><strong>PHP Version:</strong> <?php echo phpversion(); ?></p>
            <p><strong>mail() function:</strong> <?php echo function_exists('mail') ? '✅ Available' : '❌ Not Available'; ?></p>
            <p><strong>Server:</strong> <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?></p>
            <p><strong>Date:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
        </div>

        <div class="status info" style="margin-top: 20px;">
            <strong>💡 Tip:</strong> If emails are not being received, check your spam folder first. 
            If the problem persists, consider using SMTP (Gmail, SendGrid, etc.) instead of PHP mail().
        </div>
    </div>
</body>
</html>
