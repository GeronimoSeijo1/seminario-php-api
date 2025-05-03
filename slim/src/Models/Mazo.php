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
            return 0;
        }
        //Inserto en la tabla mazo
        $stmt = $db->prepare("INSERT INTO mazo (usuario_id, nombre) VALUES (:usuario_id, :nombre)");
        if ($stmt->execute([
            ':usuario_id' => $usuario_id,
            ':nombre' => $nombre
        ]))
        {
            //Inserto las cartas del mazo
            $estado = 'en_mazo';
            $stmt = $db->prepare("SELECT MAX(id) AS max_id FROM mazo");
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $mazo_id = $row['max_id'] ?? 0;
            $values = [];
            foreach ($carta_id as $id) {
                $values[] = "($id, $mazo_id, '$estado')";
            }
            $valuesString = implode(", ", $values);
            $stmt = $db->prepare("INSERT INTO `mazo_carta` (`carta_id`, `mazo_id`, `estado`) VALUES $valuesString");
            $stmt->execute();
            return $mazo_id;
        }
        else 
        {
            return 0;

        }
    }
}