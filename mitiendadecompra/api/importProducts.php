<?php
require 'config.php';
$user = $_SESSION['user'] ?? null;
if(!$user) jsonOut(['success'=>false, 'message'=>'Auth required']);

$input = json_decode(file_get_contents('php://input'), true);
$products = $input['products'] ?? null;
if(!is_array($products)) jsonOut(['success'=>false,'message'=>'Formato inválido']);

$pdo->beginTransaction();
try{
  $pdo->exec("DELETE FROM productos");
  $stmt = $pdo->prepare("INSERT INTO productos (id, nombre, descripcion, precio, stock, imagen, categoria, vendidos, created_at) VALUES (?,?,?,?,?,?,?,?,?)");
  foreach($products as $p){
    $stmt->execute([
      $p['id'] ?? null,
      $p['nombre'] ?? '',
      $p['descripcion'] ?? '',
      $p['precio'] ?? 0,
      $p['stock'] ?? 0,
      $p['imagen'] ?? null,
      $p['categoria'] ?? null,
      $p['vendidos'] ?? 0,
      $p['created_at'] ?? date('Y-m-d H:i:s')
    ]);
  }
  $pdo->commit();
  jsonOut(['success'=>true,'message'=>'Importado']);
}catch(Exception $e){
  $pdo->rollBack();
  jsonOut(['success'=>false,'message'=>$e->getMessage()]);
}
