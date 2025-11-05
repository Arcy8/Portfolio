<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "reactphp");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

$firstname = $data["firstname"] ?? "";
$lastname = $data["lastname"] ?? "";
$pnumber = $data["pnumber"] ?? "";
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

if (strlen($email) < 15) {
    echo json_encode(["success" => false, "message" => "Email must be at least 15 characters long"]);
    exit;
}
if (!str_ends_with($email, "@gmail.com")) {
    echo json_encode(["success" => false, "message" => "Email must end with @gmail.com"]);
    exit;
}
if (strlen($password) <= 8) {
    echo json_encode(["success" => false, "message" => "Password must be more than 8 characters"]);
    exit;
}
if (empty($pnumber)) {
    echo json_encode(["success" => false, "message" => "Phone number is required"]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("SELECT id FROM users_tbl WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit;
}
$stmt->close();

$stmt = $conn->prepare("INSERT INTO users_tbl (firstname, lastname, pnumber, email, password) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $firstname, $lastname, $pnumber, $email, $hashed_password);
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Registration successful"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>