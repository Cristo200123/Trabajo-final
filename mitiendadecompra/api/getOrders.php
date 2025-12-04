<?php
require 'config.php';
$user = $_SESSION['user'] ?? null;
if(!$user) jsonOut(['success'=>false, 'message'=>'Auth required']);

if($user['role_id'] == 2){
  $stmt = $pdo->query("SELECT * FROM pedidos ORDER BY created_at DESC");
  $pedidos = $stmt->fetchAll();
} else {
  $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY created_at DESC");
  $stmt->execute([$user['id']]);
  $pedidos = $stmt->fetchAll();
}

jsonOut(['success'=>true, 'orders'=>$pedidos]);
