<?php
require 'config.php';
$input = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user']['id'] ?? null;
$items = $input['items'] ?? null;
$total = $input['total'] ?? 0;

if (!$user_id) jsonOut(['success'=>false,'message'=>'No autorizado']);
if (!$items || !is_array($items)) jsonOut(['success'=>false,'message'=>'Items required']);

try {
  $pdo->beginTransaction();

  // validar stock
  foreach ($items as $it) {
    $stmt = $pdo->prepare("SELECT stock, precio FROM productos WHERE id = ?");
    $stmt->execute([$it['id']]);
    $p = $stmt->fetch();
    if (!$p) throw new Exception("Producto no encontrado: ".$it['id']);
    if ($p['stock'] < $it['cantidad']) throw new Exception("Stock insuficiente para: ".$it['id']);
  }

  // crear venta
  $stmt = $pdo->prepare("INSERT INTO ventas (usuario_id, total) VALUES (?, ?)");
  $stmt->execute([$user_id, $total]);
  $venta_id = $pdo->lastInsertId();

  // insertar detalle y actualizar stock
  foreach ($items as $it) {
    $stmt = $pdo->prepare("SELECT precio FROM productos WHERE id = ?");
    $stmt->execute([$it['id']]);
    $p = $stmt->fetch();
    $precio = $p['precio'];

    $stmt = $pdo->prepare("INSERT INTO ventas_detalle (venta_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)");
    $stmt->execute([$venta_id, $it['id'], $it['cantidad'], $precio]);

    $stmt = $pdo->prepare("UPDATE productos SET stock = stock - ? WHERE id = ?");
    $stmt->execute([$it['cantidad'], $it['id']]);
  }

  $pdo->commit();
  jsonOut(['success'=>true,'venta_id'=>$venta_id]);

} catch (Exception $e) {
  $pdo->rollBack();
  jsonOut(['success'=>false,'message'=>$e->getMessage()]);
}
