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

  // INTENTIONAL: pricing logic incomplete/incorrect (candidate must implement rules exactly)
  $discount_percent = 0;

  if ($pricing_mode === 'standard') {
    if ($qty > 5) $discount_percent = 10;
    else if ($qty > 10) $discount_percent = 5; // wrong ordering (intentional)
  } elseif ($pricing_mode === 'bulk') {
    if ($qty >= 10) $discount_percent = 10;
    else $discount_percent = 5; // missing >=20 => 15% and bulk min qty rule (intentional)
  } elseif ($pricing_mode === 'clearance') {
    $discount_percent = 20; // missing floor rule (intentional)
  }

  $subtotal = $unit_price * $qty;
  $discount_amount = $subtotal * ($discount_percent / 100.0);
  $total_price = $subtotal - $discount_amount;

  // INTENTIONAL SECURITY ISSUE: not using prepared statements
  $sql = "INSERT INTO products (name, unit_price, qty, pricing_mode, discount_percent, total_price)
          VALUES ('$name', '$unit_price', '$qty', '$pricing_mode', '$discount_percent', '$total_price')";

  $ok = $conn->query($sql);
  if (!$ok) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB insert failed']);
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
