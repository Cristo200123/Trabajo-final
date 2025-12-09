<?php
$host = "localhost";
$usuario = "root";   // si usás XAMPP o Laragon
$clave = "";          // si usás XAMPP generalmente está vacío
$bd = "mitiendadecompra";

$conexion = new mysqli($host, $usuario, $clave, $bd);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

// Para que use UTF8 y no se rompan caracteres
$conexion->set_charset("utf8");
?>
