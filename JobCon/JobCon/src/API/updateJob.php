<?php
// Set timezone to PHT
date_default_timezone_set('Asia/Manila');

// Enable error logging, suppress display
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// Set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check mysqli extension
if (!extension_loaded('mysqli')) {
    error_log("mysqli extension not loaded");
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "mysqli extension is not loaded"]);
    exit;
}

// Connect to database
$conn = new mysqli("localhost", "root", "", "reactphp");
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Verify table existence
$result = $conn->query("SHOW TABLES LIKE 'jobs'");
if ($result->num_rows === 0) {
    error_log("Table 'jobs' does not exist");
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Table 'jobs' does not exist"]);
    exit;
}

$result = $conn->query("SHOW TABLES LIKE 'chatbot_questions'");
if ($result->num_rows === 0) {
    error_log("Table 'chatbot_questions' does not exist");
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Table 'chatbot_questions' does not exist"]);
    exit;
}

// Check request method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    error_log("Invalid request method: " . $_SERVER["REQUEST_METHOD"]);
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Get POST data
$id = $_POST['id'] ?? '';
$jobPosition = $_POST['jobPosition'] ?? '';
$jobDescription = $_POST['jobDescription'] ?? '';
$descriptionBullets = $_POST['descriptionBullets'] ?? '[]';
$requirementsBullets = $_POST['requirementsBullets'] ?? '[]';
$chatbotQuestions = $_POST['chatbotQuestions'] ?? '[]';
$location = $_POST['location'] ?? 'Remote (US-based)';
$type = $_POST['type'] ?? 'Full-time · Permanent';
$salary = $_POST['salary'] ?? '$90,000–$110,000/year';
$experience = $_POST['experience'] ?? 'Not specified';
$education = $_POST['education'] ?? 'Not specified';
$postedDate = $_POST['postedDate'] ? date('Y-m-d H:i:s', strtotime($_POST['postedDate'])) : date('Y-m-d H:i:s');

error_log("Received data: id=$id, jobPosition=$jobPosition, chatbotQuestions=$chatbotQuestions");

// Validate required fields
if (empty($id) || empty($jobPosition) || empty($jobDescription)) {
    error_log("Missing required fields: id=$id, jobPosition=$jobPosition, jobDescription=$jobDescription");
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Validate JSON
$decodedChatbotQuestions = json_decode($chatbotQuestions, true);
if (!json_decode($descriptionBullets) || !json_decode($requirementsBullets) || $decodedChatbotQuestions === null) {
    error_log("Invalid JSON: descriptionBullets=$descriptionBullets, requirementsBullets=$requirementsBullets, chatbotQuestions=$chatbotQuestions");
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON format for descriptionBullets, requirementsBullets, or chatbotQuestions"]);
    exit;
}

// Begin transaction
$conn->begin_transaction();

try {
    // Verify job exists
    $stmt = $conn->prepare("SELECT id FROM jobs WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Prepare statement failed for job check: " . $conn->error);
    }
    $stmt->bind_param("i", $id);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        $stmt->close();
        $conn->rollback();
        error_log("Job not found for id=$id");
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Job not found"]);
        exit;
    }
    $stmt->close();

    // Update job
    $stmt = $conn->prepare("UPDATE jobs SET position = ?, description = ?, description_bullets = ?, requirements_bullets = ?, location = ?, type = ?, salary = ?, experience = ?, education = ?, posted_date = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Prepare statement failed for job update: " . $conn->error);
    }
    $stmt->bind_param("ssssssssssi", $jobPosition, $jobDescription, $descriptionBullets, $requirementsBullets, $location, $type, $salary, $experience, $education, $postedDate, $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update job: " . $stmt->error);
    }
    $stmt->close();

    // Delete existing questions
    $stmt = $conn->prepare("DELETE FROM chatbot_questions WHERE job_id = ?");
    if (!$stmt) {
        throw new Exception("Prepare statement failed for deleting questions: " . $conn->error);
    }
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete existing questions: " . $stmt->error);
    }
    $stmt->close();

    // Insert new questions
    if (!empty($decodedChatbotQuestions)) {
        $stmt = $conn->prepare("INSERT INTO chatbot_questions (job_id, question) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Prepare statement failed for chatbot questions: " . $conn->error);
        }
        foreach ($decodedChatbotQuestions as $question) {
            if (!empty(trim($question))) {
                $stmt->bind_param("is", $id, $question);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to add chatbot question: " . $stmt->error);
                }
            }
        }
        $stmt->close();
    }

    // Commit transaction
    $conn->commit();
    error_log("Job updated successfully: id=$id");
    echo json_encode(["success" => true, "message" => "Job and questions updated successfully"]);
} catch (Exception $e) {
    $conn->rollback();
    error_log("Error updating job: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error updating job: " . $e->getMessage()]);
}

$conn->close();
?>