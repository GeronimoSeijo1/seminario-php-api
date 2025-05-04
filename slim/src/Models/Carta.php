<?php

namespace App\Models;

use PDO;
use DB;

class Carta{

    public function obtenerCartasDelMazo($idMazo): array{
        $db = DB::getConnection();
        $stmt = $db->prepare("
            SELECT mc.carta_id AS numero_carta, c.nombre
            FROM mazo_carta mc
            JOIN carta c ON mc.carta_id = c.id
            WHERE mc.mazo_id = :idMazo AND mc.estado = 'en_mano'
        ");
        $stmt->bindParam(':idMazo', $idMazo);
        $stmt->execute();

        //Retorna un arreglo con el id y nombre de las cartas del mazo
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerCartasDeLaPartida($idPartida): array {
        $db = DB::getConnection();
        $stmt = $db->prepare("
            SELECT mc.carta_id AS id, c.nombre
            FROM mazo_carta mc
            JOIN carta c ON mc.carta_id = c.id
            JOIN partida p ON mc.mazo_id = p.mazo_id
            WHERE p.id = :idPartida AND mc.estado = 'en_mano'
        ");
        $stmt->bindParam(':idPartida', $idPartida);
        $stmt->execute();
    
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


}