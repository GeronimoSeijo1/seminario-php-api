<?php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Usuario;

class UsuarioController {
    
    public function obtenerUsuario(Request $request, Response $response, $args){
        $id = $args['id']; // El ID viene desde la URL

        $usuario = new Usuario();
        $usuarioId = $usuario->obtenerUsuarioID($id);

        if(!$usuarioId){
            $response->getBody()->write(json_encode(['error' => 'Usuario no encontrado']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        $response->getBody()->write(json_encode($usuarioId));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

    }

    public function obtenerUsuarios(Request $request, Response $response, $args) {
        $usuario = new Usuario();
        $usuarios = $usuario->obtenerTodos();

        $response->getBody()->write(json_encode($usuarios));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function crearUsuario(Request $request, Response $response, $args){
        $datos = $request->getParsedBody();
        $errores;

        // Usuario entre 6 y 20 caracteres
        if (strlen($datos['usuario']) < 6 || strlen($datos['usuario']) > 20) {
            $errores[] = 'El nombre de usuario debe tener entre 6 y 20 caracteres.';
        }
        // Usuario solo alfanumérico
        if (!ctype_alnum($datos['usuario'])) {
            $errores[] = 'El nombre de usuario solo puede contener caracteres alfanuméricos.';
        }
        // Password mínimo 8 caracteres
        if (strlen($datos['password']) < 8) {
            $errores[] = "La contraseña debe tener al menos 8 caracteres.";
        }
        // Password debe tener letras y números
        if (!preg_match('/[a-zA-Z]/', $datos['password']) || !preg_match('/[0-9]/', $datos['password'])) {
            $errores[] = "La contraseña debe contener letras y números.";
        }

        
        //Si hubo, muestra mensaje de error
        if(!is_null($errores)){
            $response->getBody()->write(json_encode(['error' => $errores]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        // Validar si el usuario ya existe en la base
        $modelo = new Usuario();
        if ($modelo->existeNombreUsuario($datos['usuario'])) {
            $response->getBody()->write(json_encode(['error' => 'El nombre de usuario ya está en uso']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        $usuario = new Usuario();
        $usuario->crear($datos['usuario'], $datos['password']);
        $response->getBody()->write(json_encode(['mensaje' => 'Usuario creado']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        
    }

    public function editarUsuario(Request $request, Response $response, $args){
        $id = $args['id']; // El ID viene desde la URL
        $datos = $request->getParsedBody();

        // Validar si el ID existe
        $modelo = new Usuario();
        if (!$modelo->logueado($id)) {
            $response->getBody()->write(json_encode(['error' => 'El usuario con ese ID no existe']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        $errores;
        //VALIDA DATOS INGRESADOS
        // Nombre solo letras
        if (!ctype_alpha($datos['nombre'])) {
            $errores[] = 'El nombre debe contener unicamente letras.';
        }
        // Password mínimo 8 caracteres
        if (strlen($datos['password']) < 8) {
            $errores[] = "La contraseña debe tener al menos 8 caracteres.";
        }
        // Password debe tener letras y números
        if (!preg_match('/[a-zA-Z]/', $datos['password']) || !preg_match('/[0-9]/', $datos['password'])) {
            $errores[] = "La contraseña debe contener letras y números.";
        }

        //Si hubo errores, muestra mensaje
        if(!is_null($errores)){
            $response->getBody()->write(json_encode(['error' => $errores]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        if($modelo->modificarUsuario($id, $datos['nombre'], $datos['password'])){
            $response->getBody()->write(json_encode(['mensaje' => 'Usuario actualizado']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            
        } else{
            $response->getBody()->write(json_encode(['error' => 'No se pudo actualizar el usuario']));
            return $response->withHeader('Content-Type', 'application/json');
        }
        



    }

    public function retornarToken(Request $request, Response $response, $args){
        $datos = $request->getParsedBody();

        $modelo = new Usuario();
        $existe=$modelo->existeUsuario($datos['usuario'], $datos['nombre'], $datos['password']);
        if(!$existe){
            $response->getBody()->write(json_encode(['error' => 'Usuario no registrado']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }

        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $vencimiento = date('Y-m-d H:i:s', strtotime('+1 hour'));
        $token = rand(1000, 9999);

        if(!$modelo->crearToken($datos['usuario'], $vencimiento, $token)){
            $response->getBody()->write(json_encode(['error' => 'No se pudo generar token']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }


        $response->getBody()->write(json_encode(['mensaje' => 'Usuario encontrado']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);


    }

}
