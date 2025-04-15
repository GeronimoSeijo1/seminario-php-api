<?php
namespace App\Models;

use PDO;
use Config\DB;

class Usuario {
    private $conn;
    private $table = "usuario";

    public function __construct() {
        $database = new DB();
        $this->conn = $database->connect();
    }

    //Devuelve: id, nom y user del ID pasado por param
    public function obtenerUsuarioID($id){
        $sql = "SELECT id, nombre, usuario FROM usuario WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    
        return $stmt->fetch(PDO::FETCH_ASSOC); // Devuelve array asociativo o false
    }

    //Devuelve todos los usuarios logueados
    public function obtenerTodos() {
        $sql = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //Crea un nuevo usuario
    public function crear($usuario, $password) {
        $sql = "INSERT INTO usuario (usuario, password) VALUES (:usuario, :password)";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':password', $password);

        return $stmt->execute();

    }

    //Verifica si existe nombre de usuario en la base de datos
    public function existeNombreUsuario($usuario){
        $sql = "SELECT COUNT(*) FROM usuario WHERE usuario = :usuario";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':usuario', $usuario);
        $stmt->execute();

        return $stmt->fetchColumn() > 0;
    }

    //Verifica si existe ID en la base de datos
    public function logueado($id){
        $sql = "SELECT COUNT(*) FROM usuario WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetchColumn() > 0;
    }

    //Modifica usuario
    public function modificarUsuario($id, $nombre, $password){
        $sql = "UPDATE usuario SET nombre = :nombre, password = :password WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    //Verifica si existe el usuario en la base de datos
    public function existeUsuario($usuario,$nombre,$password){
        $sql = "SELECT * FROM usuario WHERE usuario = :usuario LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->execute();

        $u = $stmt->fetch(PDO::FETCH_ASSOC);

        //Si el usuario no existe en la bd, retorna false
        if (!$u) return false;

        //Si el usuario existe, corrobora nombre
        if ($u['nombre'] !== $nombre) return false;

        //Si el usuario existe, corrobora password
        if ($u['password'] !== $password) return false;

        return true;
    }

    public function crearToken($usuario,$vencimiento_token,$token){
        $sql = "UPDATE usuario SET token = :token, vencimiento_token = :vencimiento_token WHERE usuario = :usuario";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':vencimiento_token', $vencimiento_token);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':usuario', $usuario);

        return $stmt->execute();
    }

}
