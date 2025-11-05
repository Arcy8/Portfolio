<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "reactphp");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$question = $_POST['question'] ?? '';

if (!$question) {
    echo json_encode(["success" => false, "message" => "Question is required"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO chatbot_questions (text, created_at) VALUES (?, NOW())");
$stmt->bind_param("s", $question);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Question added successfully"]);

$stmt->close();
$conn->close();
?>