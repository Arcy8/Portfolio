<?php
date_default_timezone_set('Asia/Manila');
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');
ob_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

function sendJsonResponse($success, $message, $data = [], $httpCode = 200) {
    ob_end_clean();
    http_response_code($httpCode);
    echo json_encode(["success" => $success, "message" => $message, "data" => $data]);
    exit;
}

session_start();
if (isset($_SESSION['user_id'])) {
    sendJsonResponse(true, "User data retrieved", ["user" => ["id" => $_SESSION['user_id']]]);
} else {
    sendJsonResponse(false, "No user logged in", []);
}
?>