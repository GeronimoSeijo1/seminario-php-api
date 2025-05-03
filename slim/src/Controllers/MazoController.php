<?php

namespace App\Controllers;

use App\Models\Mazo;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class MazoController
{
    private $mazoModel;

    public function __construct(Mazo $mazoModel)
    {
        $this->mazoModel = $mazoModel;
    }
    
    public function crearMazo(Request $request, Response $response) {
        $user = $request->getAttribute('user');
        $usuario_id = $user['id'];
        $data = $request->getParsedBody();
        $carta_id = $data['carta_id'] ?? '';
        $nombre = $data['nombre'] ?? '';
        $idUnicos = array_unique($carta_id);
        foreach ($carta_id as $id){
            if ($id>25)
            {
                $response->getBody()->write(json_encode(['error' => 'Valor incorrecto de ID']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
        }
        if (count($carta_id) == 5 ){
            if (count($idUnicos)!==5)
            {
                $response->getBody()->write(json_encode(['error' => 'ID de cartas repetidos']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
        }
        else 
        {
            $response->getBody()->write(json_encode(['error' => 'Cantidad incorrecta de cartas']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $mazo_id = $this->mazoModel->insertarMazo($usuario_id,$carta_id,$nombre);
        if ($mazo_id>0)
        {
            $response->getBody()->write(json_encode(['mazo_id' => $mazo_id, 'nombre' => $data['nombre']]));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');;
        }
        else 
        {
            $response->getBody()->write(json_encode(['error' => 'Limite de mazos por usuario']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }

}