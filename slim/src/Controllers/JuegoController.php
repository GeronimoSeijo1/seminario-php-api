<?php

namespace App\Controllers;

use App\Models\Mazo;
use App\Models\Partida;
use App\Models\Carta;
use App\Models\User;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class JuegoController{
    private $mazoModel;
    private $partidaModel;
    private $cartaModel;

    public function __construct(Mazo $mazoModel, Partida $partidaModel, Carta $cartaModel){
        $this->mazoModel = $mazoModel;
        $this->partidaModel = $partidaModel;
        $this->cartaModel = $cartaModel;
    }

    public function crearPartida(Request $request, Response $response, $args){
        try{
            $user = $request->getAttribute('user');
            $idUsuario = $user['id'];

            //Obtiene mazo_id pasado por postman
            $datos = $request->getParsedBody();
            $idMazo = $datos['mazo_id'] ?? null;

            if(!$idMazo){
                $response->getBody()->write(json_encode(['error' => 'Debe proporcionar mazo_id']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            //Valida que el mazo pertenezca al usuario
            if(!$this->mazoModel->perteneceAUsuario($idMazo, $idUsuario)){
                $response->getBody()->write(json_encode(['error' => 'El mazo no pertenece al usuario logueado']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            //Crea partida para usuario logueado, con fecha actual y estado "en_curso"
            $idPartida = $this->partidaModel->crear($idUsuario, $idMazo);
            if(!$idPartida){
                $response->getBody()->write(json_encode(['error' => 'No se pudo crear la partida']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            //Actualiza el estado de las cartas a "en_mano"
            $this->mazoModel->actualizarCartasEnMano($idMazo);

            //Lista de las cartas del usuario -> devuelve su id y nombre
            $cartas = $this->cartaModel->obtenerCartasDelMazo($idMazo);

            $respuesta = [
                'id_partida' => $idPartida,
                'cartas' => $cartas
            ];

            $response->getBody()->write(json_encode($respuesta));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');

        } catch (\PDOException $e) {
            error_log("Error de base de datos al crear la partida: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Error general al crear la partida: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
        
    }

    public function obtenerCartasEnMano(Request $request, Response $response, $args){

        try{
            $usuarioId = (int) $args['usuario'];
            $partidaId = (int) $args['partida'];
            
            $user = $request->getAttribute('user');
            $usuarioLogueadoId = $user['id'];

            //Verifico que los datos que se piden sean del usuario logueado
            if ($usuarioId !== $usuarioLogueadoId) {
                $response->getBody()->write(json_encode(['error' => 'No tienes permiso para ver la información de este usuario.']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            //Valida que la partida pertenezca al usuario
            if (!$this->partidaModel->perteneceAUsuario($partidaId, $usuarioId)) {
                $response->getBody()->write(json_encode(['error' => 'La partida no pertenece al usuario']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            // Lista las cartas 'en_mano' del usuario
            $cartas = $this->cartaModel->obtenerCartasDeLaPartida($partidaId);

            $response->getBody()->write(json_encode(['cartas' => $cartas]));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');

        } catch (\PDOException $e) {
            error_log("Error de base de datos al obtener las cartas: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Error general al obtener las cartas: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
        
    }

}
