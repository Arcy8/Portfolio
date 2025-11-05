<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "reactphp");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

$data = json_decode(file_get_contents("php://input"));

$admin_email = $data->admin_email;
$admin_password = $data->admin_password;

$result = $conn->query("SELECT * FROM admins_tbl WHERE admin_email='$admin_email'");

if ($row = $result->fetch_assoc()) {
    if ($admin_password === $row['admin_password']) {  
        echo json_encode(["success" => true, "message" => "Login successful"]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Admin not found"]);
}

$conn->close();
?>