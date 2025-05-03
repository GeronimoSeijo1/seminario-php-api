<?php

namespace App\Models;

use DB;
use PDO;

class Partida
{
    public static function obtenerPartidaPorIdYUsuario(int $partidaId, int $usuarioId): ?array
    {
        $db = DB::getConnection();
        $stmt = $db->prepare("SELECT id, mazo_id, estado FROM partida WHERE id = :id AND usuario_id = :usuario_id");
        $stmt->bindParam(':id', $partidaId);
        $stmt->bindParam(':usuario_id', $usuarioId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function actualizarGanadorPartida(int $partidaId, string $elUsuario): bool
    {
        $db = DB::getConnection();
        $stmt = $db->prepare("UPDATE partida SET el_usuario = :el_usuario, estado = 'finalizada' WHERE id = :id");
        $stmt->bindParam(':el_usuario', $elUsuario);
        $stmt->bindParam(':id', $partidaId);
        return $stmt->execute();
    }
}