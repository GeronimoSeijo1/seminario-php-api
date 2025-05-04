<?php

namespace App\Models;

use PDO;
use DB;

class Mazo{

    //Verifica si el mazo pertenece al usuario
    public function perteneceAUsuario($idMazo, $idUsuario): bool{
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT id FROM mazo WHERE id = :idMazo AND usuario_id = :idUsuario");
        $stmt->bindParam(':idMazo', $idMazo);
        $stmt->bindParam(':idUsuario', $idUsuario);
        $stmt->execute();
        
        return $stmt->fetchColumn() > 0;  // true si encontró, false si no
    }

    // Actualiza las cartas del mazo a estado 'en_mano'
    public function actualizarCartasEnMano($idMazo){
        $db = DB::getConnection();
        $stmt = $db->prepare("UPDATE mazo_carta SET estado = 'en_mano' WHERE mazo_id = :idMazo");
        $stmt->bindParam(':idMazo', $idMazo);
        $stmt->execute();
    }

}