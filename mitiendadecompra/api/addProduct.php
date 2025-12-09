<?php
require 'config.php';
$user = $_SESSION['user'] ?? null;
if(!$user) jsonOut(['success'=>false, 'message'=>'Auth required']);

$input = json_decode(file_get_contents('php://input'), true);

$nombre        = $input['nombre']        ?? '';
$precio        = $input['precio']        ?? 0;
$stock         = $input['stock']         ?? 0;
$descripcion   = $input['descripcion']   ?? '';
$categoria_id  = $input['categoria_id']  ?? null;
$imagen        = $input['imagen']        ?? null;

if(!$nombre)
    jsonOut(['success'=>false,'message'=>'Nombre requerido']);

$stmt = $pdo->prepare("
    INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen)
    VALUES (?,?,?,?,?,?)
");

$stmt->execute([
    $nombre,
    $descripcion,
    $precio,
    $stock,
    $categoria_id,
    $imagen
]);

jsonOut([
    'success' => true, 
    'message' => 'Producto agregado',
    'id'      => $pdo->lastInsertId()
]);
?>

jsonOut(['success'=>true, 'message'=>'Producto agregado', 'id'=>$pdo->lastInsertId()]);
