<?php

namespace App\Models;

use PDO;
use DB;

class Partida{

    public function crear($idUsuario, $idMazo): ?int {
        $db = DB::getConnection();

        $fecha = date('Y-m-d H:i:s');
        $estado = "en_curso";

        $stmt = $db->prepare("INSERT INTO partida (usuario_id, fecha, mazo_id, estado) VALUES (:idUsuario, :fecha, :idMazo, :estado)");

        $stmt->bindParam(':idUsuario', $idUsuario);
        $stmt->bindParam(':fecha', $fecha);
        $stmt->bindParam(':idMazo', $idMazo);
        $stmt->bindParam(':estado', $estado);

        if ($stmt->execute()) {
            return (int) $db->lastInsertId(); //Retorna el último id de la tabla
        }

        return null;
    }

    public function perteneceAUsuario($idPartida, $idUsuario): bool {
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT id FROM partida WHERE id = :idPartida AND usuario_id = :idUsuario");
        $stmt->bindParam(':idPartida', $idPartida);
        $stmt->bindParam(':idUsuario', $idUsuario);
        $stmt->execute();
    
        return $stmt->fetchColumn() > 0;
    }

}