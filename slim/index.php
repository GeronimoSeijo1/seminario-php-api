<?php
date_default_timezone_set('America/Argentina/Buenos_Aires');

use App\Controllers\Auth\AuthController;
use App\Controllers\JuegoController;
use App\Controllers\UserController;
use App\Controllers\JuegoController;
use App\Middleware\AuthMiddleware;
use App\Models\Carta;
use App\Models\Jugada;
use App\Models\MazoCarta;
use App\Models\Partida;
use App\Models\User;
use App\Models\Mazo;
use App\Models\Partida;
use App\Models\Carta;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/config/DB.php';

$app = AppFactory::create();

// Add body parsing middleware
$app->addBodyParsingMiddleware();

// Add error middleware
$app->addErrorMiddleware(true, true, true);

$app->get('/', function ($request, $response, $args) {
    $response->getBody()->write("¡Funciono!");
    return $response;
});

// Add CORS middleware
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
        ->withHeader('Content-Type', 'application/json');
});

$userModel = new User(); 
$userController = new UserController($userModel);
$authController = new AuthController($userModel, $_ENV['JWT_SECRET'] ?? 'your-secret-key');
$mazoCartaModel = new MazoCarta();
$mazoModel = new Mazo();
$jugadaModel = new Jugada();
$partidaModel = new Partida();
$cartaModel = new Carta();
$juegoController = new JuegoController($mazoModel,$mazoCartaModel, $jugadaModel, $partidaModel, $cartaModel);

$app->post('/registro', [$userController, 'registro']);

$app->post('/login', [$authController, 'login']);

$authMiddleware = AuthMiddleware::initialize();

// Agrupar y proteger las rutas de usuario
$app->group('/usuarios', function ($group) use ($userController) { 
    $group->put('/{id:[0-9]+}', [$userController, 'update']); // El parámetro es 'id' y forzamos que sea número
    $group->get('/{id:[0-9]+}', [$userController, 'get']);    
})->add($authMiddleware);

$app->post('/partidas', [$juegoController, 'crearPartida'])->add($authMiddleware);
$app->post('/jugadas', [$juegoController, 'realizarJugada'])->add($authMiddleware);
$app->get('/usuarios/{usuario}/partidas/{partida}/cartas', [$juegoController, 'obtenerCartasEnMano'])->add($authMiddleware);

$app->run();