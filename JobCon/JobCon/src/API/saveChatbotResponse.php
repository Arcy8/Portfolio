<?php
// Set timezone to PHT
date_default_timezone_set('Asia/Manila');

// Enable error logging, suppress display in production
ini_set('display_errors', 0); // Set to 1 for debugging, then revert to 0
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// Ensure no output before JSON
ob_start();

// Set headers for JSON response and CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Function to send JSON response and exit
function sendJsonResponse($success, $message, $httpCode = 200) {
    ob_end_clean(); // Clear any output buffer
    http_response_code($httpCode);
    echo json_encode(["success" => $success, "message" => $message]);
    exit;
}

// Check mysqli extension
if (!extension_loaded('mysqli')) {
    error_log("mysqli extension not loaded");
    sendJsonResponse(false, "mysqli extension is not loaded", 500);
}

// Check curl extension
if (!extension_loaded('curl')) {
    error_log("curl extension not loaded");
    sendJsonResponse(false, "curl extension is not loaded", 500);
}

// Connect to database
$conn = new mysqli("localhost", "root", "", "reactphp");
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    sendJsonResponse(false, "Database connection failed: " . $conn->connect_error, 500);
}

// Verify table existence
$result = $conn->query("SHOW TABLES LIKE 'chatbot_responses'");
if ($result->num_rows === 0) {
    error_log("Table 'chatbot_responses' does not exist");
    sendJsonResponse(false, "Table 'chatbot_responses' does not exist", 500);
}

// Check if evaluation column exists
$result = $conn->query("SHOW COLUMNS FROM chatbot_responses LIKE 'evaluation'");
if ($result->num_rows === 0) {
    error_log("Evaluation column missing in chatbot_responses");
    sendJsonResponse(false, "Evaluation column missing in chatbot_responses table", 500);
}

// Get POST data
$sessionId = $_POST['sessionId'] ?? '';
$questionId = $_POST['questionId'] ?? '';
$answer = $_POST['answer'] ?? '';
$jobPosition = $_POST['jobPosition'] ?? '';
$userEmail = $_POST['userEmail'] ?? '';

error_log("Received data: sessionId=$sessionId, questionId=$questionId, jobPosition=$jobPosition, userEmail=$userEmail, answer=$answer");

// Validate required fields
if (empty($sessionId) || empty($questionId) || empty($answer) || empty($jobPosition) || empty($userEmail)) {
    error_log("Missing required fields: sessionId=$sessionId, questionId=$questionId, answer=$answer, jobPosition=$jobPosition, userEmail=$userEmail");
    sendJsonResponse(false, "All fields are required", 400);
}

// Validate questionId is numeric
if (!is_numeric($questionId) || (int)$questionId <= 0) {
    error_log("Invalid questionId: $questionId");
    sendJsonResponse(false, "Invalid question ID", 400);
}

// Get job_id from jobs table
$stmt = $conn->prepare("SELECT id FROM jobs WHERE position = ?");
if (!$stmt) {
    error_log("Prepare statement failed for job lookup: " . $conn->error);
    sendJsonResponse(false, "Prepare statement failed: " . $conn->error, 500);
}
$stmt->bind_param("s", $jobPosition);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    $jobId = $row['id'];
} else {
    error_log("Job not found for position: $jobPosition");
    sendJsonResponse(false, "Job position not found", 404);
}
$stmt->close();

// Verify question exists
$stmt = $conn->prepare("SELECT question FROM chatbot_questions WHERE job_id = ? LIMIT 1 OFFSET ?");
if (!$stmt) {
    error_log("Prepare statement failed for question check: " . $conn->error);
    sendJsonResponse(false, "Prepare statement failed: " . $conn->error, 500);
}
$offset = (int)$questionId - 1; // Convert 1-based index to 0-based offset
$stmt->bind_param("ii", $jobId, $offset);
$stmt->execute();
$result = $stmt->get_result();
$questionRow = $result->fetch_assoc();
if (!$questionRow) {
    error_log("Invalid question ID: $questionId for job_id: $jobId");
    sendJsonResponse(false, "Invalid question ID", 400);
}
$questionText = $questionRow['question'];
$stmt->close();

// Call Groq API to evaluate the response
$evaluation = callLLMForEvaluation($questionText, $answer, $jobPosition);

// Save response and evaluation
$stmt = $conn->prepare("INSERT INTO chatbot_responses (session_id, job_id, user_email, question_id, answer, evaluation) VALUES (?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    error_log("Prepare statement failed for insert: " . $conn->error);
    sendJsonResponse(false, "Prepare statement failed: " . $conn->error, 500);
}
$stmt->bind_param("sisiss", $sessionId, $jobId, $userEmail, $questionId, $answer, $evaluation);

if ($stmt->execute()) {
    error_log("Response saved successfully: sessionId=$sessionId, questionId=$questionId");
    sendJsonResponse(true, "Response saved successfully");
} else {
    error_log("Failed to save response: " . $stmt->error);
    sendJsonResponse(false, "Failed to save response: " . $stmt->error, 500);
}

$stmt->close();
$conn->close();

// Function to call Groq API for evaluation
function callLLMForEvaluation($question, $answer, $jobPosition) {
    $apiKey = ""; // Replace with your actual Groq API key (starts with 'gsk_')
    $apiUrl = "https://api.groq.com/openai/v1/chat/completions";

    $prompt = "You are an HR expert evaluating a candidate's response for a $jobPosition role. Question: $question. Candidate's Response: $answer. Provide a concise evaluation (max 150 words) on relevance, clarity, and suitability. End with a score out of 10.";

    $data = [
        "model" => "llama-3.1-8b-instant", // Fast, free-tier friendly
        "messages" => [
            ["role" => "system", "content" => "Be objective, professional, and brief."],
            ["role" => "user", "content" => $prompt]
        ],
        "max_tokens" => 200,
        "temperature" => 0.7,
    ];

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $apiKey",
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30); // Prevent hangs

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        error_log("Curl error in Groq API call: $curlError");
        return "Evaluation failed: Curl error ($curlError)";
    }

    if ($httpCode === 200 && $response) {
        $result = json_decode($response, true);
        if (isset($result['choices'][0]['message']['content'])) {
            return $result['choices'][0]['message']['content'];
        } else {
            error_log("Invalid Groq response structure: " . $response);
            return "Evaluation failed: Invalid response from Groq";
        }
    } else {
        error_log("Groq API call failed: HTTP $httpCode, Response: $response");
        return "Evaluation failed: Unable to connect to Groq (HTTP $httpCode)";
    }
}
?>