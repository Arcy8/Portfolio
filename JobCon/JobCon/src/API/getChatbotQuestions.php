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
header("Access-Control-Allow-Methods: GET");
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

$result = $conn->query("SHOW TABLES LIKE 'chatbot_questions'");
if ($result->num_rows === 0) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Table 'chatbot_questions' does not exist"]);
    exit;
}

$jobPosition = $_GET['jobPosition'] ?? '';

if (empty($jobPosition)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Job position is required"]);
    exit;
}

$stmt = $conn->prepare("SELECT cq.question FROM chatbot_questions cq JOIN jobs j ON cq.job_id = j.id WHERE j.position = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare statement failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $jobPosition);
$stmt->execute();
$result = $stmt->get_result();

$questions = [];
while ($row = $result->fetch_assoc()) {
    $questions[] = $row['question'];
}

if (!empty($questions)) {
    echo json_encode(["success" => true, "questions" => $questions]);
} else {
    echo json_encode(["success" => false, "message" => "No questions found for this job", "questions" => []]);
}

$stmt->close();
$conn->close();
?>