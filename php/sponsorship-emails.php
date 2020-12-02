<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

if (!isset($_POST)) {
    die("Move along, nothing to see here.");
}

$application = $_POST['application'];
$emailArray = $_POST["emailArray"];
$applicationAdmin = $application['admin'];
$applicationStatus = $applicationAdmin['approvalStatus'];
$applicationSubmissionInfo = $application['submission'];
$applicationType = $applicationSubmissionInfo['sponsorshipSelect'];
$applicantEmail = $applicationSubmissionInfo['primaryEmail'];
$emailTableRows = '';
$emailSent = false;

foreach ($emailArray as &$value) {
    $emailTableRows .= '<tr><td>' . $value . '</td></tr>';
}

if(strlen($emailTableRows) > 0) {
    sendEmail($emailTableRows, $emailArray, $applicantEmail);
}

function buildEmailMessage($emailTableRows) {
    $message = '<html><body>';
    $message .= '<table rules="all" border="0" cellpadding="5" width="600" style="border-color: white;">';
    $message .= '<tr>';
    $message .= '<td style="border: none;" width="200"><img width="200" height="51" src="https://www.midrivers.com/wp-content/uploads/2020/04/MR-FullColor.png" alt="Mid-Rivers" /></td>';
    $message .= '<td style="border: none;" valign="middle"><h2>Mid-Rivers Sponsorship Request</h2></td>';
    $message .= '</tr>';
    $message .= '</table>';
    $message .= '<table rules="all" border="0" cellpadding="5" width="600"><tbody>';
    $message .= $emailTableRows;
    $message .= '</tbody></table>';
    $message .= '</body></html>';

    return $message;
}

function sendEmail($emailTableRows, $emailArray, $applicantEmail) {
    //$to = $applicantEmail;
    $to = "rowland.charles@gmail.com";
    $subject = "Mid-Rivers Community Sponsorship Request";
    $headers = "From: sponsorship_request@midrivers.com\r\n";
    $headers .= "Cc: nichole.senner@midrivers.coop\r\n";
    $headers .= "Reply-To: noreply@midrivers.com\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
    $headers .= "Content-Transfer-Encoding: 64bit\r\n";
    $body = buildEmailMessage($emailTableRows);

    if (mail($to, $subject, $body, $headers)) {
        returnData(["status" => true, "emailArray" => $emailArray, "body" => $body]);
    } else {
        returnData(["status" => false]);
    }
}


function returnData($dataArray) {
    echo json_encode($dataArray);
    exit();
}
