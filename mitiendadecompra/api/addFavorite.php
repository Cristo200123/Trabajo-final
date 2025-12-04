<?php
require 'config.php';
// espera POST form/urlencoded o JSON
$input = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user']['id'] ?? null;
$product_id = $input['product_id'] ?? ($_POST['product_id'] ?? null);

if (!$user_id) jsonOut(['success'=>false,'message'=>'No autorizado']);
if (!$product_id) jsonOut(['success'=>false,'message'=>'product_id required']);

try {
  $stmt = $pdo->prepare("INSERT IGNORE INTO favoritos (usuario_id, producto_id) VALUES (?, ?)");
  $stmt->execute([$user_id, $product_id]);
  jsonOut(['success'=>true,'message'=>'Favorito agregado']);
} catch (Exception $e) {
  jsonOut(['success'=>false,'message'=>$e->getMessage()]);
}
