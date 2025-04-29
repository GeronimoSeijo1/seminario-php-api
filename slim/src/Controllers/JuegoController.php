<?php

namespace App\Controllers;

use App\Models\Juego;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class JuegoController{
    private $juegoModel;
    private $userModel;

    public function __construct(Juego $juegoModel, User $userModel){
        $this->juegoModel = $juegoModel;
        $this->userModel = $userModel;
    }

    public function crearPartida(Request $request, Response $response, $args){
        $user = $request->getAtribute('user');
    }
}
