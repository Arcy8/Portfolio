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

$questionId = $_POST['questionId'] ?? '';

if (!$questionId) {
    echo json_encode(["success" => false, "message" => "Question ID is required"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM chatbot_questions WHERE id = ?");
$stmt->bind_param("i", $questionId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Question deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Question not found"]);
}

$stmt->close();
$conn->close();
?>