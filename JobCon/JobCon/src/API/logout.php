<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Start the session
session_start();

// Destroy the session
session_unset();
session_destroy();

// Return success response
echo json_encode(["success" => true, "message" => "Logged out successfully"]);
?>