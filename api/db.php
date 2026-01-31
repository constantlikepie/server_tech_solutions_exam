<?php
$DB_HOST = '127.0.0.1';
$DB_NAME = 'dev_test';
$DB_USER = 'root';
$DB_PASS = '';

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($conn->connect_error) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['success' => false, 'error' => 'DB connection failed']);
  exit;
}
$conn->set_charset('utf8mb4');
