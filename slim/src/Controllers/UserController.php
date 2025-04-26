<?php

namespace App\Controllers;

use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController
{
    private $userModel;

    public function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    public function registro(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        $nombre = $data['nombre'] ?? '';
        $usuario = $data['usuario'] ?? '';
        $password = $data['password'] ?? '';

        // Primero, verificar si el usuario ya existe
        if ($this->userModel->getUserByUsername($usuario)) {
            $response->getBody()->write(json_encode(['error' => 'El nombre de usuario ya está en uso.']));
            return $response->withStatus(409)->withHeader('Content-Type', 'application/json'); // 409 Conflict
        }

        // Si el usuario no existe, proceder con las validaciones
        if (strlen($usuario) < 6 || strlen($usuario) > 20 || !ctype_alnum($usuario)) {
            $response->getBody()->write(json_encode(['error' => 'El nombre de usuario debe tener entre 6 y 20 caracteres alfanuméricos.']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        if (strlen($password) < 8 || !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:\'",.<>\/?]).{8,}$/', $password)) {
            $response->getBody()->write(json_encode(['error' => 'La clave debe tener al menos 8 caracteres y contener mayúsculas, minúsculas, números y caracteres especiales.']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $token = bin2hex(random_bytes(32)); // Generar un token básico
        $vencimientoToken = (new \DateTime())->modify('+1 hour')->format('Y-m-d H:i:s'); // Establecer vencimiento a 1 hora

        if ($this->userModel->createUser($nombre, $usuario, $password, $token, $vencimientoToken)) {
            $response->getBody()->write(json_encode(['message' => 'Usuario registrado exitosamente.', 'token' => $token])); // Devolvemos el token
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json'); // 201 Created
        } else {
            $response->getBody()->write(json_encode(['error' => 'Error al registrar el usuario.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json'); // 500 Internal Server Error
        }   
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $requestedUsername = $args['usuario'];

        if ($user['usuario'] !== $requestedUsername) {
            $response->getBody()->write(json_encode(['error' => 'No tienes permiso para editar este usuario.']));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        $data = $request->getParsedBody();
        $nombre = $data['nombre'] ?? null;
        $password = $data['password'] ?? null;

        if ($nombre !== null || $password !== null) {
            if ($this->userModel->updateProfile($user['id'], $nombre, $password)) {
                $response->getBody()->write(json_encode(['message' => 'Perfil actualizado exitosamente.']));
                return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
            } else {
                $response->getBody()->write(json_encode(['error' => 'Error al actualizar el perfil.']));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }
        } else {
            $response->getBody()->write(json_encode(['error' => 'Debe proporcionar al menos un campo para actualizar (nombre o password).']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $requestedUsername = $args['usuario'];

        if ($user['usuario'] !== $requestedUsername) {
            $response->getBody()->write(json_encode(['error' => 'No tienes permiso para ver la información de este usuario.']));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        $userData = [
            'id' => $user['id'],
            'nombre' => $user['nombre'],
            'usuario' => $user['usuario'],
        ];

        $response->getBody()->write(json_encode($userData));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
}   