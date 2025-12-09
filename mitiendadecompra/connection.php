<?php
$host = "localhost";
$user = "root";
$pass = ""; // si tenés contraseña ponela acá
$dbname = "mitiendadecompra";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>
