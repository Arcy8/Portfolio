<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "reactphp");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$email = isset($_GET['email']) ? $_GET['email'] : null;
if (!$email) {
    echo json_encode(["success" => false, "message" => "Email parameter is required"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT 
            r.name, 
            r.email, 
            r.phone, 
            r.linkedin, 
            r.ai_summary, 
            r.skills, 
            r.experience, 
            r.education, 
            r.projects, 
            r.profession, 
            r.location, 
            r.upload_date, 
            u.email as user_email
        FROM resumes r
        JOIN users_tbl u ON r.email = u.email
        WHERE r.email = ?
        ORDER BY r.upload_date DESC
        LIMIT 1
    ");
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $resume = $result->fetch_assoc();

    if (!$resume) {
        echo json_encode(["success" => false, "message" => "No resume data found for this user"]);
        $stmt->close();
        $conn->close();
        exit;
    }

    // Parse JSON fields
    $profile = [
        "name" => $resume["name"] ?: "Professional Profile",
        "email" => $resume["email"],
        "phone" => $resume["phone"],
        "linkedin" => $resume["linkedin"],
        "profession" => $resume["profession"] ?: "",
        "location" => $resume["location"] ?: "",
        "ai_summary" => $resume["ai_summary"] ? json_decode($resume["ai_summary"], true) : null,
        "skills" => $resume["skills"] ? json_decode($resume["skills"], true) : [],
        "experience" => $resume["experience"] ? json_decode($resume["experience"], true) : [],
        "education" => $resume["education"] ? json_decode($resume["education"], true) : [],
        "projects" => $resume["projects"] ? json_decode($resume["projects"], true) : [],
        "upload_date" => $resume["upload_date"],
        "user_email" => $resume["user_email"]
    ];

    echo json_encode(["success" => true, "profile" => $profile]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    $stmt->close();
    $conn->close();
    exit;
}
?>