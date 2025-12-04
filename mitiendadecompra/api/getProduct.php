<?php
require 'config.php';
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if(!$id) jsonOut(['success'=>false, 'message'=>'id required']);
$stmt = $pdo->prepare("SELECT * FROM productos WHERE id = ?");
$stmt->execute([$id]);
$p = $stmt->fetch();
if(!$p) jsonOut(['success'=>false,'message'=>'Producto no encontrado']);
jsonOut(['success'=>true, 'product'=>$p]);
