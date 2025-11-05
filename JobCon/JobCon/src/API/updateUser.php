<?php
// Enable CORS to match users.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


// Database connection
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "reactphp";


$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
    exit;
}


$response = ['success' => false, 'message' => ''];


$input = json_decode(file_get_contents('php://input'), true);
$userId = filter_var($input['userId'] ?? '', FILTER_VALIDATE_INT);
$firstname = filter_var($input['firstname'] ?? '', FILTER_SANITIZE_STRING);
$lastname = filter_var($input['lastname'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$pnumber = filter_var($input['phone'] ?? '', FILTER_SANITIZE_STRING);
$password = $input['password'] ?? '';
$address = filter_var($input['address'] ?? '', FILTER_SANITIZE_STRING);
$emergency_contact = filter_var($input['emergency_contact'] ?? '', FILTER_SANITIZE_STRING);
$birth_date = filter_var($input['birth_date'] ?? '', FILTER_SANITIZE_STRING);
$marital_status = filter_var($input['marital_status'] ?? '', FILTER_SANITIZE_STRING);
$religion = filter_var($input['religion'] ?? '', FILTER_SANITIZE_STRING);
$education = filter_var($input['education'] ?? '', FILTER_SANITIZE_STRING);
$family = $input['family'] ?? ['mother' => '', 'father' => '', 'siblings' => []];
$bio = filter_var($input['bio'] ?? '', FILTER_SANITIZE_STRING);


// Validate inputs
if (!$userId) {
    $response['message'] = 'User ID not provided.';
    echo json_encode($response);
    exit;
}
if (empty($firstname) || strlen($firstname) < 2) {
    $response['message'] = 'First name must be at least 2 characters.';
    echo json_encode($response);
    exit;
}
if (empty($lastname) || strlen($lastname) < 2) {
    $response['message'] = 'Last name must be at least 2 characters.';
    echo json_encode($response);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Invalid email format.';
    echo json_encode($response);
    exit;
}
if (empty($pnumber)) {
    $response['message'] = 'Phone number is required.';
    echo json_encode($response);
    exit;
}
if (!empty($password) && strlen($password) < 8) {
    $response['message'] = 'Password must be at least 8 characters.';
    echo json_encode($response);
    exit;
}
if (!empty($birth_date) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $birth_date)) {
    $response['message'] = 'Invalid birth date format (YYYY-MM-DD).';
    echo json_encode($response);
    exit;
}


try {
    $query = "UPDATE users_tbl SET firstname = ?, lastname = ?, email = ?, pnumber = ?, address = ?, emergency_contact = ?, birth_date = ?, marital_status = ?, religion = ?, education = ?, family = ?, bio = ?";
    $params = [$firstname, $lastname, $email, $pnumber, $address, $emergency_contact, $birth_date ?: null, $marital_status, $religion, $education, json_encode($family), $bio];


    if (!empty($password)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $query .= ", password = ?";
        $params[] = $hashedPassword;
    }


    $query .= " WHERE id = ?";
    $params[] = $userId;


    $stmt = $conn->prepare($query);
    if (!$stmt) {
        $response['message'] = 'Prepare failed: ' . $conn->error;
        echo json_encode($response);
        exit;
    }


    $stmt->bind_param(str_repeat('s', count($params) - 1) . 'i', ...$params);
   
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Profile updated successfully.';
    } else {
        $response['message'] = 'Failed to update profile.';
    }


    $stmt->close();
} catch (Exception $e) {
    $response['message'] = 'Server error: ' . $e->getMessage();
}


$conn->close();
echo json_encode($response);
?>
