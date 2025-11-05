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

$result = $conn->query("SHOW TABLES LIKE 'chatbot_questions'");
if ($result->num_rows === 0) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Table 'chatbot_questions' does not exist"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$jobPosition = $_POST['jobPosition'] ?? '';
$jobDescription = $_POST['jobDescription'] ?? '';
$descriptionBullets = $_POST['descriptionBullets'] ?? '[]';
$requirementsBullets = $_POST['requirementsBullets'] ?? '[]';
$chatbotQuestions = $_POST['chatbotQuestions'] ?? '[]';
$location = $_POST['location'] ?? 'Remote (PH-based)';
$type = $_POST['type'] ?? 'Full-time · Permanent';
$salary = $_POST['salary'] ?? '₱50,000–₱70,000/month';
$experience = $_POST['experience'] ?? 'Not specified';
$education = $_POST['education'] ?? 'Not specified';
$postedDate = $_POST['postedDate'] ? date('Y-m-d H:i:s', strtotime($_POST['postedDate'])) : date('Y-m-d H:i:s');

if (empty($jobPosition) || empty($jobDescription)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Validate JSON for bullets and chatbot questions
$decodedChatbotQuestions = json_decode($chatbotQuestions, true);
if (!json_decode($descriptionBullets) || !json_decode($requirementsBullets) || $decodedChatbotQuestions === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON format for descriptionBullets, requirementsBullets, or chatbotQuestions"]);
    exit;
}

// Begin transaction to ensure atomicity
$conn->begin_transaction();

try {
    // Insert job
    $stmt = $conn->prepare("INSERT INTO jobs (position, description, description_bullets, requirements_bullets, location, type, salary, experience, education, posted_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Prepare statement failed for job insertion: " . $conn->error);
    }
    $stmt->bind_param("ssssssssss", $jobPosition, $jobDescription, $descriptionBullets, $requirementsBullets, $location, $type, $salary, $experience, $education, $postedDate);
    if (!$stmt->execute()) {
        throw new Exception("Failed to add job: " . $stmt->error);
    }
    $jobId = $conn->insert_id;
    $stmt->close();

    // Insert chatbot questions
    if (!empty($decodedChatbotQuestions)) {
        $stmt = $conn->prepare("INSERT INTO chatbot_questions (job_id, question) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Prepare statement failed for chatbot questions: " . $conn->error);
        }
        foreach ($decodedChatbotQuestions as $question) {
            if (!empty(trim($question))) {
                $stmt->bind_param("is", $jobId, $question);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to add chatbot question: " . $stmt->error);
                }
            }
        }
        $stmt->close();
    }

    // Commit transaction
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Job and questions added successfully"]);
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>