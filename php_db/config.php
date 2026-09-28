<?php
// php_db/config.php - Database configuration for JanSathi MySQL Database

$host = '127.0.0.1';
$port = 3306;
$db_name = 'jansathi_db';
$username = 'root';
$password = '';

function getDBConnection() {
    global $host, $port, $db_name, $username, $password;
    
    try {
        // First connect without DB selected to ensure database exists
        $pdo = new PDO("mysql:host=$host;port=$port;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `$db_name`");
        
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database connection failed: " . $e->getMessage()]);
        exit;
    }
}
?>
