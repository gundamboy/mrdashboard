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
$status = false;




echo json_encode(array(
    "application" => $application,
    "emailArray" => $emailArray,
    "id" => $application["id"],
    "stars" => "************************************************************************"
));
