<?php
require 'config.php';
$user = $_SESSION['user'] ?? null;
if(!$user) jsonOut(['success'=>false, 'message'=>'Auth required']);

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? 0;
if(!$id) jsonOut(['success'=>false,'message'=>'id required']);

$stmt = $pdo->prepare("DELETE FROM productos WHERE id = ?");
$stmt->execute([$id]);
jsonOut(['success'=>true,'message'=>'Producto eliminado']);
