<?php
header('Content-Type: application/json');

// SMTP Settings for Hostinger
define('SMTP_HOST', 'ssl://smtp.hostinger.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'hello@dilipgelot.in');
define('SMTP_PASS', 'xkvw-ucjx-utc5-ahbt');
define('ADMIN_EMAIL_1', 'gelotdilip9@gmail.com');
define('ADMIN_EMAIL_2', 'hello@dilipgelot.in');

// Basic request validation
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation
if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all the required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid email address.']);
    exit;
}

if (!preg_match('/^\+?[0-9\s\-]{6,20}$/', $phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid mobile number.']);
    exit;
}

// Helper to read SMTP response
function smtp_response($socket, $expected_code)
{
    $response = "";
    while (true) {
        $line = fgets($socket, 512);
        if ($line === false) {
            break;
        }
        $response .= $line;
        // SMTP response lines have code (3 digits) followed by '-' for multi-line, or ' ' for the last line.
        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }
    $code = substr($response, 0, 3);
    if ($code != $expected_code) {
        throw new Exception("SMTP Error: Expected $expected_code, got " . trim($response));
    }
    return $response;
}

// SMTP Mail Sender Function
function send_smtp_email($to, $subject, $html_content, $from_name = 'Dilip Gelot')
{
    $socket = @fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, 15);
    if (!$socket) {
        throw new Exception("SMTP connection failure: $errstr ($errno)");
    }

    smtp_response($socket, '220');

    fwrite($socket, "EHLO localhost\r\n");
    smtp_response($socket, '250');

    fwrite($socket, "AUTH LOGIN\r\n");
    smtp_response($socket, '334');

    fwrite($socket, base64_encode(SMTP_USER) . "\r\n");
    smtp_response($socket, '334');

    fwrite($socket, base64_encode(SMTP_PASS) . "\r\n");
    smtp_response($socket, '235');

    fwrite($socket, "MAIL FROM:<" . SMTP_USER . ">\r\n");
    smtp_response($socket, '250');

    fwrite($socket, "RCPT TO:<" . $to . ">\r\n");
    smtp_response($socket, '250');

    fwrite($socket, "DATA\r\n");
    smtp_response($socket, '354');

    // Headers
    $headers = [
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "From: =?UTF-8?B?" . base64_encode($from_name) . "?= <" . SMTP_USER . ">",
        "To: <" . $to . ">",
        "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=",
        "Date: " . date('r'),
        "X-Mailer: PHP/" . phpversion()
    ];

    $email_body = implode("\r\n", $headers) . "\r\n\r\n" . $html_content;

    // Escape dots at the beginning of a line
    $email_body = str_replace("\r\n.", "\r\n..", $email_body);

    fwrite($socket, $email_body . "\r\n.\r\n");
    smtp_response($socket, '250');

    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return true;
}

try {
    // 1. Build and send email to Dilip (Admin notification)
    $admin_subject = "New Portfolio Inquiry from " . htmlspecialchars($name);
    $admin_body = '
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 20px; color: #333; }
            .container { max-width: 600px; background: #fff; padding: 30px; border-radius: 8px; border: 1px solid #ddd; }
            h2 { color: #ff9800; border-bottom: 2px solid #ff9800; padding-bottom: 10px; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; }
            th { background-color: #f9f9f9; width: 150px; }
            .message-box { background-color: #fcfcfc; border-left: 3px solid #ff9800; padding: 15px; margin-top: 15px; font-style: italic; white-space: pre-wrap; }
            .meta { font-size: 11px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>New Inquiry Details</h2>
            <table>
                <tr><th>Name</th><td>' . htmlspecialchars($name) . '</td></tr>
                <tr><th>Email</th><td>' . htmlspecialchars($email) . '</td></tr>
                <tr><th>Mobile</th><td>' . htmlspecialchars($phone) . '</td></tr>
            </table>
            <h3>Project Details / Message:</h3>
            <div class="message-box">' . nl2br(htmlspecialchars($message)) . '</div>
            <div class="meta">
                Submitted on: ' . date('Y-m-d H:i:s') . '<br>
                IP Address: ' . htmlspecialchars($_SERVER['REMOTE_ADDR']) . '
            </div>
        </div>
    </body>
    </html>
    ';

    // Send admin notification to both addresses
    send_smtp_email(ADMIN_EMAIL_1, $admin_subject, $admin_body, "Dilip Gelot Portfolio");
    send_smtp_email(ADMIN_EMAIL_2, $admin_subject, $admin_body, "Dilip Gelot Portfolio");

    // 2. Build and send premium confirmation email to the Inquirer
    $inquirer_subject = "Thank you for contacting Dilip Gelot";
    $inquirer_body = '
    <html>
    <head>
        <style>
            body { font-family: "Outfit", Arial, sans-serif; background-color: #0d0d0d; margin: 0; padding: 0; color: #ffffff; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #0d0d0d; padding: 40px 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .header { background-color: #161616; padding: 40px 30px; text-align: center; border-bottom: 1px solid #222222; }
            .logo { font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 1px; }
            .logo-dot { color: #ff9800; }
            .content { padding: 40px 30px; line-height: 1.6; }
            h2 { color: #ffffff; font-size: 24px; font-weight: 500; margin-top: 0; margin-bottom: 20px; }
            p { color: #aaaaaa; font-size: 15px; margin-bottom: 20px; }
            .details-box { background-color: #161616; border-left: 3px solid #ff9800; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0; }
            .details-box h3 { color: #ffffff; font-size: 16px; margin-top: 0; margin-bottom: 15px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
            .details-row { display: flex; margin-bottom: 8px; font-size: 14px; }
            .details-label { width: 100px; color: #888888; font-weight: bold; }
            .details-value { color: #dddddd; flex: 1; }
            .details-message { margin-top: 10px; color: #bbbbbb; font-style: italic; white-space: pre-wrap; word-break: break-all; }
            .footer { background-color: #161616; padding: 30px; text-align: center; border-top: 1px solid #222222; font-size: 12px; }
            .footer p { color: #666666; font-size: 12px; margin: 0 0 15px 0; }
            .social-links { margin: 15px 0; }
            .social-links a { color: #ff9800; text-decoration: none; margin: 0 10px; font-weight: 500; }
            .btn { display: inline-block; background-color: #ff9800; color: #000000 !important; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; margin-top: 15px; }
            .btn:hover { background-color: #e68900; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <div class="logo">Dilip Gelot<span class="logo-dot">.</span></div>
                </div>
                <div class="content">
                    <h2>Hello ' . htmlspecialchars($name) . ',</h2>
                    <p>Thank you for reaching out! I have received your message and will review it shortly. I appreciate your interest in collaborating or getting in touch.</p>
                    <p>Here is a record of the information you submitted:</p>
                    
                    <div class="details-box">
                        <h3>Inquiry Summary</h3>
                        <div class="details-row">
                            <span class="details-label">Email:</span>
                            <span class="details-value">' . htmlspecialchars($email) . '</span>
                        </div>
                        <div class="details-row">
                            <span class="details-label">Mobile:</span>
                            <span class="details-value">' . htmlspecialchars($phone) . '</span>
                        </div>
                        <div class="details-message"><strong>Message:</strong><br>' . nl2br(htmlspecialchars($message)) . '</div>
                    </div>

                    <p>I typically respond to new inquiries within 24-48 business hours. In the meantime, you can review some of my latest projects or connect with me via social media below.</p>
                    
                    <center>
                        <a href="https://dilipgelot.in" class="btn">Visit My Website</a>
                    </center>
                </div>
                <div class="footer">
                    <p>&copy; ' . date('Y') . ' Dilip Gelot. All rights reserved.</p>
                    <div class="social-links">
                        <a href="https://www.linkedin.com/in/dilipgelot/">LinkedIn</a>
                        <a href="https://github.com/DilipGelot">GitHub</a>
                        <a href="https://wa.link/m2lswf">WhatsApp</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    ';

    send_smtp_email($email, $inquirer_subject, $inquirer_body, "Dilip Gelot");

    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your message has been sent successfully. A confirmation email has been sent to ' . htmlspecialchars($email) . '.'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while sending your message: ' . $e->getMessage()
    ]);
}
