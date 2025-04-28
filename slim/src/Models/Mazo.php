<?php

namespace App\Models;

use PDO;
use DB; // Importa la clase DB

class Mazo
{
    public static function insertarMazo(String $usuario_id, array $carta_id, String $nombre) {
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT COUNT(*) as total_mazos FROM mazo WHERE usuario_id = ?");
        $stmt->execute([$usuario_id]);
        $totalMazos = $stmt->fetchColumn();

        if ($totalMazos > 2) {
            return null;
        }

        
        //Inserto las cartas del mazo
        $estado = 'en_mazo';
        $values = [];
        foreach ($carta_id as $index => $id) {
            $values[] = "(" . ($index + 1) . ", $id, $mazo_id, '$estado')";
        }
        $valuesString = implode(", ", $values);
        $stmt = $db->prepare("INSERT INTO `mazo_carta` (`id`, `carta_id`, `mazo_id`, `estado`) VALUES $valuesString");
        $stmt->execute();
    }
}