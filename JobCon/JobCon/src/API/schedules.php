<?php
// Suppress error output, log to file
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
file_put_contents('php://stderr', print_r("Starting schedules.php\n", TRUE));

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Ensure JSON output
header("Content-Type: application/json");

// Database connection
$conn = new mysqli("localhost", "root", "", "reactphp");

if ($conn->connect_error) {
    file_put_contents('php://stderr', print_r("Connection failed: " . $conn->connect_error . "\n", TRUE));
    echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Get request method
$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    $userId = isset($_GET["userId"]) ? (int)$_GET["userId"] : null;
    $query = $userId
        ? "SELECT id, userId, day, date, period, start_time, end_time FROM schedules WHERE userId = ?"
        : "SELECT id, userId, day, date, period, start_time, end_time FROM schedules";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        file_put_contents('php://stderr', print_r("Prepare failed: " . $conn->error . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
        exit();
    }
    if ($userId) {
        $stmt->bind_param("i", $userId);
    }
    if (!$stmt->execute()) {
        file_put_contents('php://stderr', print_r("Execute failed: " . $stmt->error . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Execute failed: " . $stmt->error]);
        exit();
    }
    $result = $stmt->get_result();
    $schedules = [];
    while ($row = $result->fetch_assoc()) {
        $schedules[] = $row;
    }
    echo json_encode(["success" => true, "schedules" => $schedules]);
    $stmt->close();
} elseif ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data["userId"], $data["day"], $data["date"], $data["period"], $data["start_time"], $data["end_time"])) {
        file_put_contents('php://stderr', print_r("Missing fields: " . print_r($data, true) . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit();
    }

    // Validate date
    if (!DateTime::createFromFormat('Y-m-d', $data["date"])) {
        file_put_contents('php://stderr', print_r("Invalid date format: " . $data["date"] . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Invalid date format, use YYYY-MM-DD"]);
        exit();
    }

    // Validate period
    if (!in_array($data["period"], ["Morning", "Afternoon"])) {
        file_put_contents('php://stderr', print_r("Invalid period: " . $data["period"] . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Invalid period"]);
        exit();
    }

    // Validate time ranges (in 24-hour format)
    $start = strtotime($data["start_time"]);
    $end = strtotime($data["end_time"]);
    $morning_start = strtotime("00:00:00");
    $morning_end = strtotime("12:00:00");
    $afternoon_start = strtotime("12:00:00");
    $afternoon_end = strtotime("23:59:59");

    if ($data["period"] === "Morning") {
        if ($start < $morning_start || $start > $morning_end || $end < $morning_start || $end > $morning_end || $end <= $start) {
            file_put_contents('php://stderr', print_r("Invalid morning times: " . $data["start_time"] . " to " . $data["end_time"] . "\n", TRUE));
            echo json_encode(["success" => false, "error" => "Times must be between 00:00 and 12:00, and end time must be after start time"]);
            exit();
        }
    } else {
        if ($start < $afternoon_start || $start > $afternoon_end || $end < $afternoon_start || $end > $afternoon_end || $end <= $start) {
            file_put_contents('php://stderr', print_r("Invalid afternoon times: " . $data["start_time"] . " to " . $data["end_time"] . "\n", TRUE));
            echo json_encode(["success" => false, "error" => "Times must be between 12:00 and 23:59, and end time must be after start time"]);
            exit();
        }
    }

    $stmt = $conn->prepare("INSERT INTO schedules (userId, day, date, period, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        file_put_contents('php://stderr', print_r("Prepare failed: " . $conn->error . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("isssss", $data["userId"], $data["day"], $data["date"], $data["period"], $data["start_time"], $data["end_time"]);
    if (!$stmt->execute()) {
        file_put_contents('php://stderr', print_r("Execute failed: " . $stmt->error . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Execute failed: " . $stmt->error]);
        exit();
    }
    $id = $conn->insert_id;
    echo json_encode(["success" => true, "id" => $id]);
    $stmt->close();
} elseif ($method === "PUT" && isset($_GET["id"])) {
    $scheduleId = (int)$_GET["id"];
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data["userId"], $data["day"], $data["date"], $data["period"], $data["start_time"], $data["end_time"])) {
        file_put_contents('php://stderr', print_r("Missing fields: " . print_r($data, true) . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit();
    }

    // Validate date
    if (!DateTime::createFromFormat('Y-m-d', $data["date"])) {
        file_put_contents('php://stderr', print_r("Invalid date format: " . $data["date"] . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Invalid date format, use YYYY-MM-DD"]);
        exit();
    }

    // Validate period
    if (!in_array($data["period"], ["Morning", "Afternoon"])) {
        file_put_contents('php://stderr', print_r("Invalid period: " . $data["period"] . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Invalid period"]);
        exit();
    }

    // Validate time ranges
    $start = strtotime($data["start_time"]);
    $end = strtotime($data["end_time"]);
    $morning_start = strtotime("00:00:00");
    $morning_end = strtotime("12:00:00");
    $afternoon_start = strtotime("12:00:00");
    $afternoon_end = strtotime("23:59:59");

    if ($data["period"] === "Morning") {
        if ($start < $morning_start || $start > $morning_end || $end < $morning_start || $end > $morning_end || $end <= $start) {
            file_put_contents('php://stderr', print_r("Invalid morning times: " . $data["start_time"] . " to " . $data["end_time"] . "\n", TRUE));
            echo json_encode(["success" => false, "error" => "Times must be between 00:00 and 12:00, and end time must be after start time"]);
            exit();
        }
    } else {
        if ($start < $afternoon_start || $start > $afternoon_end || $end < $afternoon_start || $end > $afternoon_end || $end <= $start) {
            file_put_contents('php://stderr', print_r("Invalid afternoon times: " . $data["start_time"] . " to " . $data["end_time"] . "\n", TRUE));
            echo json_encode(["success" => false, "error" => "Times must be between 12:00 and 23:59, and end time must be after start time"]);
            exit();
        }
    }

    $stmt = $conn->prepare("UPDATE schedules SET userId = ?, day = ?, date = ?, period = ?, start_time = ?, end_time = ? WHERE id = ?");
    if (!$stmt) {
        file_put_contents('php://stderr', print_r("Prepare failed: " . $conn->error . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("isssssi", $data["userId"], $data["day"], $data["date"], $data["period"], $data["start_time"], $data["end_time"], $scheduleId);
    if (!$stmt->execute()) {
        file_put_contents('php://stderr', print_r("Execute failed: " . $stmt->error . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Execute failed: " . $stmt->error]);
        exit();
    }
    echo json_encode(["success" => true]);
    $stmt->close();
} elseif ($method === "DELETE" && isset($_GET["id"])) {
    $scheduleId = (int)$_GET["id"];
    $stmt = $conn->prepare("DELETE FROM schedules WHERE id = ?");
    if (!$stmt) {
        file_put_contents('php://stderr', print_r("Prepare failed: " . $conn->error . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("i", $scheduleId);
    if (!$stmt->execute()) {
        file_put_contents('php://stderr', print_r("Execute failed: " . $stmt->error . "\n", TRUE));
        echo json_encode(["success" => false, "error" => "Execute failed: " . $stmt->error]);
        exit();
    }
    echo json_encode(["success" => true]);
    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid endpoint or method"]);
}

$conn->close();
?>