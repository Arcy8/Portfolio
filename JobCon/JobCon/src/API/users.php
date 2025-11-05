<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}


header("Content-Type: application/json");


// Database connection
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "reactphp";


$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]));
}


// Handle API requests
$method = $_SERVER["REQUEST_METHOD"];


if ($method === "GET") {
    if (isset($_GET["id"])) {
        $userId = (int)$_GET["id"];
        $stmt = $conn->prepare("SELECT id, firstname, lastname, email, pnumber, avatar, address, emergency_contact, birth_date, marital_status, religion, education, family, bio FROM users_tbl WHERE id = ?");
        if (!$stmt) {
            echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
            exit();
        }
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        echo json_encode(["success" => true, "user" => $user]);
        $stmt->close();
    } else {
        $result = $conn->query("SELECT id, firstname, lastname, email, pnumber, avatar, address, emergency_contact, birth_date, marital_status, religion, education, family, bio FROM users_tbl");
        if (!$result) {
            echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
            exit();
        }
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode(["success" => true, "users" => $users]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid method"]);
}


$conn->close();
?>
