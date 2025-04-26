<?php

namespace App\Models;

use PDO;
use DB; // Importa la clase DB

class User
{
   
    public static function createUser(string $nombre, string $usuario, string $clave, ?string $token = null, ?string $vencimientoToken = null): bool
    {
        $db = DB::getConnection();
        $stmt = $db->prepare("INSERT INTO usuario (nombre, usuario, password, token, vencimiento_token) VALUES (:nombre, :usuario, :password, :token, :vencimiento_token)");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':password', $clave);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':vencimiento_token', $vencimientoToken);
        return $stmt->execute();
    }

    public static function getUserByUsername(string $usuario): ?array
    {
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT * FROM usuario WHERE usuario = :usuario");
        $stmt->bindParam(':usuario', $usuario);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }

    public static function updateToken(int $userId, string $token, string $vencimientoToken): bool
    {
        $db = DB::getConnection();
        $stmt = $db->prepare("UPDATE usuario SET token = :token, vencimiento_token = :vencimiento_token WHERE id = :id");
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':vencimiento_token', $vencimientoToken);
        $stmt->bindParam(':id', $userId);
        return $stmt->execute();
    }

    public static function getUserById(int $id): ?array
    {
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT id, nombre, usuario FROM usuario WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function updateProfile(int $id, ?string $nombre, ?string $password): bool
    {
        $db = DB::getConnection();
        $sql = "UPDATE usuario SET ";
        $params = [];
        $updates = [];

        if ($nombre !== null) {
            $updates[] = "nombre = :nombre";
            $params[':nombre'] = $nombre;
        }

        if ($password !== null) {
            $updates[] = "password = :password";
            $params[':password'] = $password;
        }

        $sql .= implode(', ', $updates);
        $sql .= " WHERE id = :id";
        $params[':id'] = $id;

        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }
}