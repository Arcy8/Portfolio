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

// Fetch jobs
$result = $conn->query("SELECT id, position AS jobPosition, description AS jobDescription, description_bullets AS descriptionBullets, requirements_bullets AS requirementsBullets, location, type, salary, experience, education, posted_date AS postedDate FROM jobs");

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
    exit;
}

$jobs = [];
while ($row = $result->fetch_assoc()) {
    // Fetch questions for this job
    $jobId = $row['id'];
    $questionStmt = $conn->prepare("SELECT question FROM chatbot_questions WHERE job_id = ?");
    $questionStmt->bind_param("i", $jobId);
    $questionStmt->execute();
    $questionResult = $questionStmt->get_result();
    $questions = [];
    while ($qRow = $questionResult->fetch_assoc()) {
        $questions[] = $qRow['question'];
    }
    $questionStmt->close();

    $jobs[] = [
        'id' => $row['id'],
        'jobPosition' => $row['jobPosition'] ?? '',
        'jobDescription' => $row['jobDescription'] ?? '',
        'descriptionBullets' => $row['descriptionBullets'] ?? '[]',
        'requirementsBullets' => $row['requirementsBullets'] ?? '[]',
        'chatbotQuestions' => json_encode($questions), // Return as JSON string
        'location' => $row['location'] ?? 'Remote (PH-based)',
        'type' => $row['type'] ?? 'Full-time · Permanent',
        'salary' => $row['salary'] ?? '₱50,000–₱70,000/month',
        'experience' => $row['experience'] ?? 'Not specified',
        'education' => $row['education'] ?? 'Not specified',
        'postedDate' => $row['postedDate'] ?? date('Y-m-d H:i:s')
    ];
}

echo json_encode(["success" => true, "jobs" => $jobs]);

$result->free();
$conn->close();
?>