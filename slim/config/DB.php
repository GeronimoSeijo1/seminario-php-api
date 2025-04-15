<?php

class DB{
    private static $connection;

    public static function getConnection() {
        if (!self::$connection){
            $host = $_ENV['DB_HOST'] ?? 'db';
            $dbname = $_ENV['DB_NAME'] ?? 'seminariophp';
            $user = $_ENV['DB_USER'] ?? 'seminariophp';
            $pass = $_ENV['DB_PASS'] ?? 'seminariophp';
            $port = $_ENV['DB_PORT'] ?? 3306;

            try {
                self::$connection = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die(json_encode(['error' => $e->getMessage()]));
            }
        }
        return self::$connection;
    }
}