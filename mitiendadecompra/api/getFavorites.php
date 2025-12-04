<?php
require 'config.php';
$user_id = $_SESSION['user']['id'] ?? null;
if (!$user_id) jsonOut(['success'=>false,'message'=>'No autorizado']);

$stmt = $pdo->prepare("SELECT f.producto_id, p.nombre, p.precio, p.imagen FROM favoritos f JOIN productos p ON f.producto_id = p.id WHERE f.usuario_id = ?");
$stmt->execute([$user_id]);
$rows = $stmt->fetchAll();
jsonOut(['success'=>true,'favorites'=>$rows]);
