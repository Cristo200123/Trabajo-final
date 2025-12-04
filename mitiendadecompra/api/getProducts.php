<?php
require 'config.php';

// Parámetros recibidos
$q          = $_GET['q']          ?? '';
$minPrecio  = $_GET['minPrecio']  ?? '';
$maxPrecio  = $_GET['maxPrecio']  ?? '';
$categoria  = $_GET['categoria']  ?? '';
$envio      = $_GET['envio']      ?? '';
$stockOnly  = $_GET['stock']      ?? '';   // si viene "1", mostrar solo productos con stock > 0

$sql = "SELECT p.*, c.nombre AS categoria_nombre 
        FROM productos p 
        LEFT JOIN categorias c ON c.id = p.categoria_id
        WHERE 1 ";

$params = [];

// 🔍 Buscar por nombre / descripción
if ($q !== '') {
    $sql .= " AND (p.nombre LIKE :q OR p.descripcion LIKE :q) ";
    $params[':q'] = "%$q%";
}

// 💸 Filtro precio mínimo
if ($minPrecio !== '') {
    $sql .= " AND p.precio >= :min ";
    $params[':min'] = $minPrecio;
}

// 💸 Filtro precio máximo
if ($maxPrecio !== '') {
    $sql .= " AND p.precio <= :max ";
    $params[':max'] = $maxPrecio;
}

// 🏷️ Categoría
if ($categoria !== '') {
    $sql .= " AND p.categoria_id = :cat ";
    $params[':cat'] = $categoria;
}

// 🚚 Envío gratis
if ($envio === "1") {
    $sql .= " AND p.envio_gratis = 1 ";
}

// 📦 Disponibilidad
if ($stockOnly === "1") {
    $sql .= " AND p.stock > 0 ";
}

// Orden por defecto
$sql .= " ORDER BY p.id ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

jsonOut([
    'success' => true,
    'products' => $stmt->fetchAll()
]);


