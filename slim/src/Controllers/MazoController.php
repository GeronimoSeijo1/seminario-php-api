<?php

namespace App\Controllers;

use App\Models\Mazo;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class MazoController
{
    private $mazoModel;
    private $userModel;

    public function __construct(Mazo $mazoModel, User $userModel)
    {
        $this->userModel = $userModel;
        $this->mazoModel = $mazoModel;
    }
    
    public function crearMazo(Request $request, Response $response) {
        $user = $request->getAtribute('user');
        $usuario_id = $user['id'];
        $data = $request->getParseBody();
        for (i=0; i<5;i++) {
            $carta_id[i] = $data['carta_id{i}'] ?? '';
        }
        $nombre = $data['nombre'] ?? '';
        $idUnicos = array_unique($idCarta);
        if (count($idUnicos)!==5)
        {
            $response->getBody()->write(json_encode(['error' => 'ID de cartas repetidos']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
        if ($this->userModel->insertarMazo($usuario_id,$carta_id,$nombre))

    }

}