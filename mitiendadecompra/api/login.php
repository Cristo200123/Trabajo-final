<?php
require 'config.php';

$email = $_POST['email'] ?? '';
$pass = $_POST['password'] ?? '';

if (!$email || !$pass) {
    jsonOut(['success' => false, 'message' => 'Faltan datos']);
}

// Buscar usuario por email
$stmt = $pdo->prepare("SELECT id, email, password, nombre FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    jsonOut(['success' => false, 'message' => 'Credenciales incorrectas']);
}

// Como tus contraseñas NO están hasheadas, comparamos directo
if ($pass !== $user['password']) {
    jsonOut(['success' => false, 'message' => 'Credenciales incorrectas']);
}

// Guardar sesión
$_SESSION['user'] = [
    'id' => $user['id'],
    'email' => $user['email'],
    'nombre' => $user['nombre']
];

jsonOut(['success' => true, 'user' => $_SESSION['user']]);

