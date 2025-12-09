<?php
require 'config.php';

$user = $_SESSION['user'] ?? null;
if (!$user) {
    jsonOut(['success' => false, 'message' => 'Auth required']);
}

// Obtener JSON del body
$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? 0;

// Validación
if (!$id || !is_numeric($id)) {
    jsonOut(['success' => false, 'message' => 'ID inválido']);
}

// Comprobar si existe el producto
$stmt = $pdo->prepare("SELECT id FROM productos WHERE id = ?");
$stmt->execute([$id]);
if (!$stmt->fetch()) {
    jsonOut(['success' => false, 'message' => 'Producto no encontrado']);
}

// Eliminar producto
$stmt = $pdo->prepare("DELETE FROM productos WHERE id = ?");
$stmt->execute([$id]);

jsonOut(['success' => true, 'message' => 'Producto eliminado correctamente']);

