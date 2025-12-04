<?php
require 'config.php';
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$pass = $input['password'] ?? '';
$nombre = $input['nombre'] ?? '';

if(!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonOut(['success'=>false, 'message'=>'Email inválido']);
if(strlen($pass) < 4) jsonOut(['success'=>false, 'message'=>'Contraseña muy corta']);

$hash = password_hash($pass, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO usuarios (email, password, nombre) VALUES (?,?,?)");
try{
  $stmt->execute([$email, $hash, $nombre]);
  jsonOut(['success'=>true, 'message'=>'Usuario creado']);
}catch(Exception $e){
  jsonOut(['success'=>false, 'message'=>'Error: '.$e->getMessage()]);
}
