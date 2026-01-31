<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $sql = "SELECT id, name, unit_price, qty, pricing_mode, discount_percent, total_price, created_at
          FROM products
          ORDER BY id DESC";
  $res = $conn->query($sql);
  $products = [];
  if ($res) {
    while ($row = $res->fetch_assoc()) {
      $products[] = $row;
    }
  }
  echo json_encode(['success' => true, 'products' => $products]);
  exit;
}

if ($method === 'POST') {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true) ?: [];

  $name = trim((string)($data['name'] ?? ''));
  $unit_price = (float)($data['unit_price'] ?? 0);
  $qty = (int)($data['qty'] ?? 0);
  $pricing_mode = (string)($data['pricing_mode'] ?? 'standard');

  // INTENTIONAL: incomplete validation
  if ($name === '' || $unit_price <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
  }

  // implemented
  $discount_percent = 0;

  if ($pricing_mode === 'standard') {
    if ($qty >= 10) $discount_percent = 10;
    else if ($qty >= 5) $discount_percent = 5; // corrected
  } elseif ($pricing_mode === 'bulk') {
    if ($qty >= 20) $discount_percent = 15;
    else if ($qty >= 10) $discount_percent = 10;
    else $discount_percent = 5; // corrected
  } elseif ($pricing_mode === 'clearance') {
    $discount_percent = 20; // added
  }

  $subtotal = $unit_price * $qty;
  $discount_amount = $subtotal * ($discount_percent / 100.0);
  $total_price = $subtotal - $discount_amount;

  if ($pricing_mode === 'clearance') {
    $min_price = $subtotal * 0.70;
    $total_price = max($total_price, $min_price);
  }

  // made it prepared statement
  $stmt = $conn->prepare("INSERT INTO products 
    (name, unit_price, qty, pricing_mode, discount_percent, total_price)
    VALUES (?, ?, ?, ?, ?, ?)");

  if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB prepare failed: ' . $conn->error]);
    exit;
  }

  $stmt->bind_param("sdisdd", $name, $unit_price, $qty, $pricing_mode, $discount_percent, $total_price);

  $ok = $stmt->execute();

  if (!$ok) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB insert failed: ' . $stmt->error]);
    exit;
  }

  echo json_encode([
    'success' => true,
    'discount_percent' => $discount_percent,
    'total_price' => $total_price
  ]);
  exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
