<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


// Database connection
$conn = new mysqli("localhost", "root", "", "reactphp");


// Check DB connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}


// Fetch all resumes with applicant details
$sql = "
    SELECT
        d.id,
        u.firstname,
        u.lastname,
        u.email,
        u.pnumber,
        d.upload_date AS created_at,
        d.filename,
        COALESCE(d.job_position, 'No job selected') AS job_position,
        COALESCE(d.status, 'pending') AS status,
        COALESCE(d.summary, 'No summary available') AS summary
    FROM dashboard_tbl d
    JOIN users_tbl u ON d.user_id = u.id
    ORDER BY d.upload_date DESC
";


$stmt = $conn->prepare($sql);


if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Query preparation failed"]);
    exit;
}


$stmt->execute();
$result = $stmt->get_result();


$users = [];


// Fetch and sanitize data
while ($row = $result->fetch_assoc()) {
    $users[] = [
        "id" => (int)$row["id"],
        "firstname" => htmlspecialchars($row["firstname"], ENT_QUOTES, 'UTF-8'),
        "lastname" => htmlspecialchars($row["lastname"], ENT_QUOTES, 'UTF-8'),
        "email" => htmlspecialchars($row["email"], ENT_QUOTES, 'UTF-8'),
        "pnumber" => htmlspecialchars($row["pnumber"], ENT_QUOTES, 'UTF-8'),
        "created_at" => $row["created_at"],
        "filename" => htmlspecialchars($row["filename"], ENT_QUOTES, 'UTF-8'),
        "job_position" => htmlspecialchars($row["job_position"], ENT_QUOTES, 'UTF-8'),
        "status" => htmlspecialchars($row["status"], ENT_QUOTES, 'UTF-8'),
        "summary" => $row["summary"]
    ];
}


// Return structured JSON
echo json_encode([
    "success" => true,
    "count" => count($users),
    "users" => $users
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);


$stmt->close();
$conn->close();
?>
