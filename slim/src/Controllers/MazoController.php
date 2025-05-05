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
        try{
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
                    return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
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
        } catch (\PDOException $e) {
            error_log("Error de base de datos al listar los mazos: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Error general al listar los mazos: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }


    public function eliminarMazo(Request $request, Response $response, array $args)
    {
        try{
            $user = $request->getAttribute('user');
            $usuario_id = $user['id'];
            if ($this->mazoModel->perteneceAUsuario($args['mazo'],$usuario_id)){
                if($this->mazoModel->jugado($args['mazo']))
                {
                    $response->getBody()->write(json_encode(['error' => 'Mazo ya utilizado, no se puede eliminar']));
                    return $response->withStatus(409)->withHeader('Content-Type', 'application/json');
                }
                if($this->mazoModel->eliminar($args['mazo']))
                {
                    $response->getBody()->write(json_encode(['exito' => 'Mazo eliminado']));
                    return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
                }
                else 
                {
                    $response->getBody()->write(json_encode(['error' => 'No se pudo eliminar el mazo, id incorrecto']));
                    return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
                }
            }
            else 
            {
                $response->getBody()->write(json_encode(['error' => 'El mazo no pertenece al usuario logueado']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }
        } catch (\PDOException $e) {
            error_log("Error de base de datos al eliminar mazo: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Error general al eliminar mazo: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
        
    }

    public function modificarMazo(Request $request, Response $response, array $args)
    {
        try {
            $data = $request->getParsedBody();
            $nombre = $data['nombre'];
            $mazo_id = $args['mazo'];
            $user =$request->getAttribute('user');
            $usuario_id = $user['id'];
            if ($this->mazoModel->perteneceAUsuario($mazo_id,$usuario_id)){
                if($this->mazoModel->modificarNombre($nombre,$mazo_id))
                {
                    $response->getBody()->write(json_encode(['exito' => 'Nombre de mazo modificado']));
                    return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
                }
                else 
                {
                    $response->getBody()->write(json_encode(['error' => 'No se pudo modificar el nombre del mazo, id incorrecto']));
                    return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
                }
            }
            else 
            {
                $response->getBody()->write(json_encode(['error' => 'El mazo no pertenece al usuario logueado']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }
        } catch (\PDOException $e) {
            error_log("Error de base de datos al modificar mazo: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Error general al modificar mazo: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function listarMazos(Request $request, Response $response, array $args)
    {
        try{
            $user = $request->getAttribute('user');
            if ($user['usuario']==$args['usuario'])
            {
                $lista = $this->mazoModel->listaMazos($user['id']);
                if(empty($lista))
                {
                    $response->getBody()->write(json_encode(['error' => 'El usuario no tiene mazos']));
                    return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
                }
                else
                {
                    $response->getBody()->write(json_encode(['lista de mazos del usuario logueado' => $lista]));
                    return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
                }
            }
            else 
            {
                $response->getBody()->write(json_encode(['error' => 'Acceso invalido a la informacion de este usuario']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }
        } catch (\PDOException $e) {
            error_log("Error de base de datos al listar los mazos: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Error general al listar los mazos: " . $e->getMessage());
            $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function listarCartas(Request $request, Response $response, array $args)
    {
        try{
            $params = $request->getQueryParams();
            $atributo = $params['atributo'] ?? null;
            if ($atributo){
                $atributo_id = $this->mazoModel->obtenerAtributoId($atributo);
            }
            else {
                $atributo_id = null;
            }
            $nombre = $params['nombre'] ?? null;
            $lista = $this->mazoModel->listaCartas($atributo_id,$nombre);
            if(empty($lista))
            {
                $response->getBody()->write(json_encode(['error' => 'No hay cartas que cumplan con los criterios']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
            else
            {
                $response->getBody()->write(json_encode(['lista de cartas por criterios' => $lista]));
                return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
            }
        }catch (\PDOException $e) {
                error_log("Error de base de datos al listar las cartas: " . $e->getMessage());
                $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
                error_log("Error general al listar las cartas: " . $e->getMessage());
                $response->getBody()->write(json_encode(['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}