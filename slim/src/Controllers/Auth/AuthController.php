<?php

namespace App\Controllers\Auth;

use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;
use DateTimeImmutable;

class AuthController
{
    private $userModel; 
    private $jwtSecret;

    public function __construct(User $userModel, string $jwtSecret)
    {
        $this->userModel = $userModel;
        $this->jwtSecret = $jwtSecret;

    }

    public function login(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $usuario = $data['usuario'] ?? '';
        $clave = $data['clave'] ?? '';

        $user = $this->userModel->getUserByUsername($usuario);

        if (!$user) {
            $response->getBody()->write(json_encode(['error' => 'El usuario o la contraseña que ingresó no son válidos, vuelva a intentarlo.']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json'); // 401 Unauthorized
        }
        
        // Cambia password_verify por una comparación de cadenas directa
        if ($clave !== $user['password']) {
            $response->getBody()->write(json_encode(['error' => 'El usuario o la contraseña que ingresó no son válidos, vuelva a intentarlo.']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json'); // 401 Unauthorized
        }

        $now = new DateTimeImmutable();
        $expire = $now->modify('+1 hour');
        $payload = [
            'iat' => $now->getTimestamp(),         // Issued at
            'exp' => $expire->getTimestamp(),      // Expiration time
            'sub' => $user['id'],                 // User identifier
            'user' => $user['usuario'],
        ];

        $jwt = JWT::encode($payload, $this->jwtSecret, 'HS256');
        $vencimientoToken = $expire->format('Y-m-d H:i:s');

        // Actualizar token y vencimiento en la base de datos
        $this->userModel->updateToken($user['id'], $jwt, $vencimientoToken);

        $response->getBody()->write(json_encode(['token' => $jwt]));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json'); // 200 OK
    }
}