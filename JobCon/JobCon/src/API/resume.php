<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "reactphp");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$email = $_POST['email'] ?? '';
$jobPosition = $_POST['jobPosition'] ?? 'Unspecified';
$resume = $_FILES['resume'] ?? null;

if (!$email || !$resume) {
    echo json_encode(["success" => false, "message" => "Email and resume are required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM users_tbl WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

$user_id = $user['id'];
$upload_dir = __DIR__ . "/uploads/";
if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

$fileName = basename($resume["name"]);
$fileTmp = $resume["tmp_name"];
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
$allowed = ["pdf", "docx", "jpg", "jpeg", "png"];

if (!in_array($fileExt, $allowed)) {
    echo json_encode(["success" => false, "message" => "Unsupported file type"]);
    exit;
}

$uniqueFileName = time() . "_" . uniqid("resume_", true) . "." . $fileExt;
$upload_path = $upload_dir . $uniqueFileName;

if (!move_uploaded_file($fileTmp, $upload_path)) {
    echo json_encode(["success" => false, "message" => "Failed to upload resume"]);
    exit;
}

$pythonPath = "C:\\Users\\admin\\AppData\\Local\\Programs\\Python\\Python313\\python.exe";
$scriptPath = __DIR__ . "\\analyzeResume.py";
$command = escapeshellcmd("$pythonPath $scriptPath " . escapeshellarg($upload_path));

// Capture output (including errors)
$output = shell_exec($command . " 2>&1");

// Find the second JSON block — the one that contains ai_summary
preg_match_all('/\{(?:[^{}]|(?R))*\}/', $output, $matches);

if (empty($matches[0])) {
    echo json_encode(["success" => false, "message" => "No valid JSON found in Python output", "raw_output" => $output]);
    exit;
}

// The last JSON block should contain the ai_summary
$jsonString = end($matches[0]);
$data = json_decode($jsonString, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Failed to decode JSON", "raw_output" => $output]);
    exit;
}

$summary = $data["ai_summary"] ?? $data["summary"] ?? "No summary generated";

$stmt = $conn->prepare("
    INSERT INTO dashboard_tbl (user_id, job_position, filename, summary, upload_date)
    VALUES (?, ?, ?, ?, NOW())
");
$stmt->bind_param("isss", $user_id, $jobPosition, $uniqueFileName, $summary);
$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Resume uploaded and analyzed successfully",
    "newJob" => [
        "jobPosition" => $jobPosition,
        "resume" => $uniqueFileName,
        "uploadDate" => date("Y-m-d H:i:s"),
        "summary" => $summary
    ]
]);

$stmt->close();
$conn->close();
?>