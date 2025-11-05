<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection
$conn = new mysqli("localhost", "root", "", "reactphp");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents("php://input"), true);
$userId = $input['userId'] ?? '';
$status = $input['status'] ?? '';

/**
 * Acceptable statuses that can be updated from frontend.
 * Must match exactly what React sends: "accepted", "rejected", or "pending"
 */
$allowedStatuses = ['accepted', 'rejected', 'pending'];

if (!$userId || !$status || !in_array($status, $allowedStatuses)) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

// Update status in dashboard_tbl
$sql = "UPDATE dashboard_tbl SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $userId);

if ($stmt->execute()) {

    // Fetch user details for optional notification
    $userSql = "SELECT u.email, u.firstname 
                FROM dashboard_tbl d 
                JOIN users_tbl u ON d.user_id = u.id 
                WHERE d.id = ?";
    $userStmt = $conn->prepare($userSql);
    $userStmt->bind_param("i", $userId);
    $userStmt->execute();
    $userResult = $userStmt->get_result();
    $user = $userResult->fetch_assoc();

    if ($user) {
        $to = $user['email'];
        $subject = "Application Status Update";

        // Dynamic message based on status
        if ($status === 'accepted') {
            $message = "Dear {$user['firstname']},\n\nYour application has been accepted.\n\nBest regards,\nYour Company";
        } elseif ($status === 'rejected') {
            $message = "Dear {$user['firstname']},\n\nYour application has been rejected.\n\nBest regards,\nYour Company";
        } else {
            $message = "Dear {$user['firstname']},\n\nYour application status has been changed back to pending for further review.\n\nBest regards,\nYour Company";
        }

        $headers = "From: no-reply@yourcompany.com";

        // Uncomment to send actual email
        // mail($to, $subject, $message, $headers);
    }

    echo json_encode(["success" => true, "message" => "Status updated successfully"]);

} else {
    echo json_encode(["success" => false, "message" => "Failed to update status"]);
}

$stmt->close();
if (isset($userStmt)) {
    $userStmt->close();
}
$conn->close();
?>