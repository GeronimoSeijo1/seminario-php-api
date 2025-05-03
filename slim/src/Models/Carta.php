<?php

namespace App\Models;

use DB;
use PDO;

class Carta
{
    public static function obtenerCartaPorId(int $cartaId): ?array
    {
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT id, nombre, ataque, atributo_id FROM carta WHERE id = :id");
        $stmt->bindParam(':id', $cartaId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function verificaGanadorAtributo(int $atributoId1, int $atributoId2): bool
    {
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT * FROM gana_a WHERE atributo_id = :attr1 AND atributo_id2 = :attr2");
        $stmt->bindParam(':attr1', $atributoId1);
        $stmt->bindParam(':attr2', $atributoId2);
        $stmt->execute();
        return (bool) $stmt->fetch(PDO::FETCH_ASSOC);
    }
}