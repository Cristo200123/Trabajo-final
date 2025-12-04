<?php
session_start();

// Datos de tu base de datos REAL
$DB_HOST = 'localhost';            
$DB_NAME = 'mitiendadecompra';     
$DB_USER = 'root';                 
$DB_PASS = '';                     

// Opciones de conexión
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
];

// Intentar la conexión
try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        $options
    );
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'DB connection error: ' . $e->getMessage()
    ]);
    exit;
}

// Función global para devolver JSON en otros endpoints
function jsonOut($data) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

