<?php
// CORS configuration
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");


// Handle preflight OPTIONS request (important for fetch())
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


// Database connection
$conn = new mysqli("localhost", "root", "", "reactphp");


// Check DB connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}


// Get and validate ID
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid or missing applicant ID"]);
    exit;
}


// Query: Get applicant + summary info
$sql = "
    SELECT
        d.id,
        u.firstname,
        u.lastname,
        u.email,
        d.job_position,
        COALESCE(d.summary, '') AS summary
    FROM dashboard_tbl d
    JOIN users_tbl u ON d.user_id = u.id
    WHERE d.id = ?
";


$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Failed to prepare query"]);
    exit;
}


$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();


// Return JSON result
if ($row = $result->fetch_assoc()) {
    $summaryText = trim($row["summary"]) !== ""
        ? $row["summary"]
        : "No automated summary available for this applicant.";


    echo json_encode([
        "success" => true,
        "id" => $row["id"],
        "firstname" => $row["firstname"],
        "lastname" => $row["lastname"],
        "email" => $row["email"],
        "job_position" => $row["job_position"],
        "summary" => $summaryText
    ], JSON_PRETTY_PRINT);
} else {
    echo json_encode(["success" => false, "message" => "No summary found for this applicant."]);
}


$stmt->close();
$conn->close();
?>
