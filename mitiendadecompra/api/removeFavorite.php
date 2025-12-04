<?php
require 'config.php';
$input = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user']['id'] ?? null;
$product_id = $input['product_id'] ?? ($_POST['product_id'] ?? null);

if (!$user_id) jsonOut(['success'=>false,'message'=>'No autorizado']);
if (!$product_id) jsonOut(['success'=>false,'message'=>'product_id required']);

$stmt = $pdo->prepare("DELETE FROM favoritos WHERE usuario_id = ? AND producto_id = ?");
$stmt->execute([$user_id, $product_id]);
jsonOut(['success'=>true,'message'=>'Favorito eliminado']);
