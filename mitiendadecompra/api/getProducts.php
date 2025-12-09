<?php
// Limpia cualquier salida previa (evita que aparezca JSON en pantalla)
ob_clean();
header("Content-Type: application/json; charset=utf-8");

require_once "../connection.php";

$sql = "SELECT 
            p.id,
            p.nombre,
            p.precio,
            p.stock,
            p.descripcion,
            p.imagen,
            c.nombre AS categoria
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id";

$result = $conn->query($sql);

$productos = [];

while ($row = $result->fetch_assoc()) {

    $row["precio"] = floatval($row["precio"]);

    if (!$row["imagen"] || $row["imagen"] === "") {
        $row["imagen"] = null;
    }

    $productos[] = $row;
}

echo json_encode([
    "success" => true,
    "products" => $productos
]);

ob_end_flush();
?>
