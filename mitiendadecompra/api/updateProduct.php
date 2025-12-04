<?php
require 'config.php';
$user = $_SESSION['user'] ?? null;
if(!$user) jsonOut(['success'=>false, 'message'=>'Auth required']);

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? 0;
$nombre = $input['nombre'] ?? '';
$precio = $input['precio'] ?? 0;
$stock = $input['stock'] ?? 0;
$desc = $input['descripcion'] ?? '';

if(!$id) jsonOut(['success'=>false,'message'=>'id required']);
$stmt = $pdo->prepare("UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=? WHERE id=?");
$stmt->execute([$nombre, $desc, $precio, $stock, $id]);
jsonOut(['success'=>true, 'message'=>'Producto actualizado']);
