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
header("Content-Type: application/json; charset=UTF-8");

function sendJsonResponse($success, $message, $data = [], $httpCode = 200) {
    ob_end_clean();
    http_response_code($httpCode);
    echo json_encode(["success" => $success, "message" => $message, "responses" => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!extension_loaded('mysqli')) {
    error_log("mysqli extension not loaded");
    sendJsonResponse(false, "Server error: mysqli extension is not loaded", [], 500);
}

$conn = new mysqli("localhost", "root", "", "reactphp");
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    sendJsonResponse(false, "Server error: Database connection failed", [], 500);
}
$conn->set_charset("utf8mb4");

$jobPosition = $_GET['jobPosition'] ?? '';
error_log("getApplicantResponses called with jobPosition: $jobPosition");
if (empty($jobPosition)) {
    error_log("Missing jobPosition parameter");
    sendJsonResponse(false, "Job position is required", [], 400);
}

$stmt = $conn->prepare("SELECT id FROM jobs WHERE position = ?");
if (!$stmt) {
    error_log("Prepare statement failed for job lookup: " . $conn->error);
    sendJsonResponse(false, "Server error: Prepare statement failed", [], 500);
}
$stmt->bind_param("s", $jobPosition);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    $jobId = $row['id'];
    error_log("Found job_id: $jobId for jobPosition: $jobPosition");
} else {
    error_log("Job not found for position: $jobPosition");
    sendJsonResponse(true, "No responses found for this job", [], 200);
}
$stmt->close();

$stmt = $conn->prepare(
    "SELECT cr.session_id, cr.user_email, cr.question_id, cr.answer, cr.evaluation, cq.question
     FROM chatbot_responses cr
     LEFT JOIN chatbot_questions cq ON cr.job_id = cq.job_id AND cr.question_id = cq.id
     WHERE cr.job_id = ?
     ORDER BY cr.user_email, cr.session_id, cr.question_id"
);
if (!$stmt) {
    error_log("Prepare statement failed for responses: " . $conn->error);
    sendJsonResponse(false, "Server error: Prepare statement failed", [], 500);
}
$stmt->bind_param("i", $jobId);
$stmt->execute();
$result = $stmt->get_result();

$responsesByApplicant = [];
while ($row = $result->fetch_assoc()) {
    $key = $row['user_email'] . '|' . $row['session_id'];
    if (!isset($responsesByApplicant[$key])) {
        $responsesByApplicant[$key] = [
            'user_email' => $row['user_email'],
            'session_id' => $row['session_id'],
            'responses' => [],
        ];
    }
    $questionText = $row['question'] ?? "Question ID {$row['question_id']} (not found)";
    if ($row['question'] === null) {
        error_log("Question not found for job_id: $jobId, question_id: {$row['question_id']}");
    }
    $responsesByApplicant[$key]['responses'][] = [
        'question_id' => $row['question_id'],
        'question' => $questionText,
        'answer' => $row['answer'],
        'evaluation' => $row['evaluation'] ?? "No evaluation available",
    ];
}
$stmt->close();
$conn->close();

$responses = array_values($responsesByApplicant);
error_log("Fetched " . count($responses) . " applicant response groups for jobPosition: $jobPosition, job_id: $jobId");
sendJsonResponse(true, count($responses) > 0 ? "Responses fetched successfully" : "No responses found for this job", $responses);
?>