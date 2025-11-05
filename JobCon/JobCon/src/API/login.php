<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "reactphp");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email or password missing"]);
    exit();
}

$email = $data->email;
$password = $data->password;

$query = "SELECT id, firstname, lastname, email, password FROM users_tbl WHERE email = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    error_log("Query preparation failed: " . $conn->error);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Query preparation failed"]);
    exit();
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "userId" => $row['id'],
            "firstname" => $row['firstname'],
            "lastname" => $row['lastname'],
            "email" => $row['email']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Incorrect password"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>