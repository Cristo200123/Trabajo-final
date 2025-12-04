<?php
require 'config.php';
$user = $_SESSION['user'] ?? null;
if(!$user) jsonOut(['success'=>false, 'message'=>'Auth required']);

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? 0;
$stock = $input['stock'] ?? null;
if(!$id || $stock===null) jsonOut(['success'=>false, 'message'=>'Datos requeridos']);
$stmt = $pdo->prepare("UPDATE productos SET stock = ? WHERE id = ?");
$stmt->execute([$stock, $id]);
jsonOut(['success'=>true,'message'=>'Stock actualizado']);
