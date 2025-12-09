<?php
// Obtener los datos de conexión desde las variables de entorno de Railway
$host = getenv("DB_HOST");
$user = getenv("DB_USER");
$pass = getenv("DB_PASS");
$dbname = getenv("DB_NAME");
$port = getenv("DB_PORT");

// Crear la conexión
$conn = new mysqli($host, $user, $pass, $dbname, $port);

// Verificar si hay error al conectar
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Asegurar que use UTF-8
$conn->set_charset("utf8");
?>

