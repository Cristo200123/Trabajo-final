<?php
require 'config.php';
$user = $_SESSION['user'] ?? null;
if(!$user) jsonOut(['success'=>false, 'message'=>'Auth required']);

$input = json_decode(file_get_contents('php://input'), true);
$product_id = $input['product_id'] ?? 0;
$texto = trim($input['texto'] ?? '');
$cal = intval($input['calificacion'] ?? 5);
if(!$product_id || !$texto) jsonOut(['success'=>false, 'message'=>'Datos incompletos']);

$stmt = $pdo->prepare("INSERT INTO comentarios (producto_id, usuario_id, texto, calificacion) VALUES (?,?,?,?)");
$stmt->execute([$product_id, $user['id'], $texto, $cal]);
jsonOut(['success'=>true, 'message'=>'Comentario agregado']);
