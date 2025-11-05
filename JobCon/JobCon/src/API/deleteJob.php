<?php
// Set timezone to PHT
date_default_timezone_set('Asia/Manila');

// Suppress PHP warnings to prevent HTML output
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Log errors to a file
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check if mysqli extension is loaded
if (!extension_loaded('mysqli')) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "mysqli extension is not loaded"]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "reactphp");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Verify table existence
$result = $conn->query("SHOW TABLES LIKE 'jobs'");
if ($result->num_rows === 0) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Table 'jobs' does not exist"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$id = $_POST['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Job ID is required"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM jobs WHERE id = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare statement failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $id);
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Job deleted successfully"]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Job not found"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to delete job: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>