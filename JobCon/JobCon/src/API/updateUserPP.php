<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


header("Content-Type: application/json");


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


$userId = filter_var($_POST['userId'] ?? '', FILTER_VALIDATE_INT);
error_log("Received userId: " . var_export($_POST['userId'], true)); // Debug log


// Validate inputs
if (!$userId) {
    $response['message'] = 'User ID not provided or invalid.';
    echo json_encode($response);
    exit;
}


// Handle avatar upload
$avatarPath = null;
$baseUrl = 'http://localhost/JobCon/JobCon/src/api/';
$uploadDir = 'uploads/avatars/';
if (!empty($_FILES['avatar']['name'])) {
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
    $avatarFile = $uploadDir . 'user_' . $userId . '.' . strtolower($ext);
    if ($_FILES['avatar']['size'] > 5000000) { // 5MB limit
        $response['message'] = 'Avatar file size exceeds 5MB.';
        echo json_encode($response);
        exit;
    }
    if (!in_array(strtolower($ext), ['jpg', 'jpeg', 'png'])) {
        $response['message'] = 'Avatar must be JPG or PNG.';
        echo json_encode($response);
        exit;
    }
    if (move_uploaded_file($_FILES['avatar']['tmp_name'], $avatarFile)) {
        $avatarPath = $baseUrl . $avatarFile; // Full URL
    } else {
        $response['message'] = 'Failed to upload avatar.';
        echo json_encode($response);
        exit;
    }
}


try {
    if ($avatarPath !== null) {
        $dbPath = str_replace($baseUrl, '', $avatarPath); // Store relative path in DB
        $query = "UPDATE users_tbl SET avatar = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            $response['message'] = 'Prepare failed: ' . $conn->error;
            echo json_encode($response);
            exit;
        }
        $stmt->bind_param("si", $dbPath, $userId);
       
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Avatar updated successfully.';
            $response['avatar'] = $avatarPath; // Return full URL
        } else {
            $response['message'] = 'Failed to update avatar.';
        }
        $stmt->close();
    } else {
        $response['message'] = 'No avatar file provided.';
    }
} catch (Exception $e) {
    $response['message'] = 'Server error: ' . $e->getMessage();
}


$conn->close();
echo json_encode($response);
?>
