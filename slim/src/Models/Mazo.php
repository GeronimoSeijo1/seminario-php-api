<?php

namespace App\Models;

use PDO;
use DB;

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

    public static function jugado(int $mazo_id){
        $db = DB::getConnection();
        $sql = "SELECT COUNT(*) as veces_usado FROM partida WHERE mazo_id = :mazo_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':mazo_id' => $mazo_id]);
        
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $resultado['veces_usado'] > 0; 
    }

    public static function eliminar(int $mazo_id){
        $db = DB::getConnection();
        //elimino las cartas del mazo
        $stmt = $db->prepare("DELETE FROM mazo_carta WHERE mazo_id = :mazo_id");
        if ($stmt->execute([':mazo_id' => $mazo_id])) 
        {
        //elimino el mazo
        $stmt = $db->prepare("DELETE FROM mazo WHERE id = :mazo_id");
        return $stmt->execute([':mazo_id' => $mazo_id]);
        }
        else return null;
    }

    public static function modificarNombre(String $nombre, int $mazo_id){
        $db = DB::getConnection();
        //actualizo el nombre del mazo
        $stmt = $db->prepare("UPDATE mazo SET nombre = :nombre WHERE id = :id");
        return $stmt->execute([':nombre' => $nombre,':id' => $mazo_id]);
    }

    public static function listaMazos(int $usuario_id){
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT * FROM mazo WHERE usuario_id = :usuario_id");
        $stmt->execute([':usuario_id' => $usuario_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function obtenerAtributoId($nombre){
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT id FROM atributo WHERE nombre = :nombre");
        $stmt->execute([':nombre' => $nombre]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado['id'];
    }

    public static function listaCartas($atributo_id,$nombre){
        $db = DB::getConnection();
        $sql = "SELECT nombre, atributo_id, ataque FROM carta WHERE 1=1";
        $params = [];

        if ($atributo_id!==null) {
            $sql .= " AND atributo_id = :atributo_id";
            $params[':atributo_id'] = $atributo_id;
        }

        if ($nombre!==null) {
            $sql .= " AND nombre LIKE :nombre";
            $params[':nombre'] = "%$nombre%";
        }
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

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