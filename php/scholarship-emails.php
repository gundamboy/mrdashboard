<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

if (!isset($_POST)) {
    die("Move along, nothing to see here.");
}

$userEmail = $_POST['userEmail'];
$emailArray = $_POST['emailArray'];
$name = $_POST['name'];
$mail = new PHPMailer(true);
$emailTableRows = '';


foreach ($emailArray as &$value) {
    $emailTableRows .= '<tr><td style="border: none;">' . $value . '</td></tr>';
}


if(strlen($emailTableRows) > 0) {
    sendPHPMailer($mail, $emailTableRows, $name, $userEmail);
}

function buildEmailMessage($emailTableRows) {
    $message = '<html><body>';
    $message .= '<table rules="all" border="0" cellpadding="5" width="600" style="border-color: white;"><tbody>';
    $message .= '<tr>';
    $message .= '<td style="border: none;" width="200"><img width="200" height="51" src="https://www.midrivers.com/wp-content/uploads/2020/04/MR-FullColor.png" alt="Mid-Rivers" /></td>';
    $message .= '<td style="border: none;" valign="middle"><h2>Mid-Rivers Scholarship Request</h2></td>';
    $message .= '</tr>';
    $message .= '</tbody></table>';
    $message .= '<table rules="all" border="0" cellpadding="5" width="600"><tbody>';
    $message .= $emailTableRows;
    $message .= '</tbody></table>';
    $message .= '</body></html>';

    return $message;
}

function sendPHPMailer($mail, $emailTableRows, $name, $email) {
    try {
        $mail->isSMTP();
        $mail->Host = 'smtps.midrivers.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'no_reply@midrivers.com';
        $mail->Password = 'Hcgmgro]0u';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->setFrom('no_reply@midrivers.com', 'Midrivers Sponsorships');
        $mail->addReplyTo('no_reply@midrivers.com', 'Midrivers Sponsorships');
        $mail->addAddress($email, $name);
        //$mail->addBCC('nicole.senner@midrivers.coop', 'Nicole');
        $mail->Subject = "Mid-Rivers Community Sponsorship Request";
        $mail->isHTML(true);
        $mail->Body = buildEmailMessage($emailTableRows);

        if ($mail->send()) {
            returnData(["status" => true, "post"=>$_POST]);

        } else {
            returnData(["status" => false, "phpmail-FAILED" => $mail->ErrorInfo, "post"=>$_POST]);
        }
    } catch (Exception $e) {
        returnData(["status" => false, "phpmail FAILED EXCEPTION" => $mail->ErrorInfo, "exception"=>$e, "post"=>$_POST]);
    }
}

function returnData($dataArray) {
    echo json_encode($dataArray);
    exit();
}
