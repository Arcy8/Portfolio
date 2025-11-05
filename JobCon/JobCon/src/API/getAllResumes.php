<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "reactphp");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

$email = $_GET['email'] ?? '';

if (!$email) {
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit;
}

// Query to join users_tbl and dashboard_tbl to get all job applications for the user
$sql = "SELECT dashboard_tbl.job_position, dashboard_tbl.filename, dashboard_tbl.upload_date 
        FROM dashboard_tbl 
        JOIN users_tbl ON dashboard_tbl.user_id = users_tbl.id 
        WHERE users_tbl.email = ? 
        ORDER BY dashboard_tbl.upload_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$jobs = [];

while ($row = $result->fetch_assoc()) {
    $jobs[] = [
        "position" => $row['job_position'],
        "resume" => $row['filename'],
        "uploadDate" => $row['upload_date']
    ];
}

if (count($jobs) > 0) {
    echo json_encode(["success" => true, "jobs" => $jobs]);
} else {
    echo json_encode(["success" => true, "jobs" => []]); // Return empty array if no jobs found
}

$stmt->close();
$conn->close();
?>