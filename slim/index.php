<?php
date_default_timezone_set('America/Argentina/Buenos_Aires');

use App\Controllers\Auth\AuthController;
use App\Controllers\UserController;
use App\Controllers\MazoController;
use App\Middleware\AuthMiddleware;
use App\Models\User;
use App\Models\Mazo;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

/*require_once __DIR__ . '/src/Models/User.php';
use App\Models\User;*/
/*require __DIR__ . '/src/Controllers/Auth/AuthController;.php'
use App\Controllers\Auth\AuthController;*/

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/config/DB.php';
require __DIR__ . '/src/Controllers/UserController.php';

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
$mazoModel = new Mazo();
$mazoController = new MazoController($mazoModel);

//$app->post('/usuarios/registro', [UserController::class, 'registro']);
$app->post('/registro', function ($request, $response) use ($userController) {
    return $userController->registro($request, $response);
});
//$app->post('/login', [Auth\AuthController::class, 'login']);
$app->post('/login', function ($request, $response) use ($authController) {
    return $authController->login($request, $response);
});

// Initialize the auth middleware using the static method
$authMiddleware = AuthMiddleware::initialize();

// Agrupar y proteger las rutas de usuario
$app->group('/usuarios', function ($group) use ($userController) { // Importamos $userController con 'use'
    $group->put('/{usuario}', [$userController, 'update']); // Usamos la instancia
    $group->get('/{usuario}', [$userController, 'get']);   // Usamos la instancia
})->add($authMiddleware);

$app->post('/mazos', function ($request, $response, $args) use ($mazoController){
    return $mazoController->crearMazo($request,$response);
})->add($authMiddleware);

$app->delete('/mazos/{mazo}', function ($request, $response, $args) use ($mazoController){
    return $mazoController->eliminarMazo($request,$response,$args);
})->add($authMiddleware);

$app->put('/mazos/{mazo}', function ($request, $response, $args) use ($mazoController){
    return $mazoController->modificarMazo($request,$response,$args);
})->add($authMiddleware);

$app->get('/usuarios/{usuario}/mazos', function ($request, $response, $args) use ($mazoController){
    return $mazoController->listarMazos($request,$response,$args);
})->add($authMiddleware);

$app->get('/cartas', function ($request, $response, $args) use ($mazoController){
    return $mazoController->listarCartas($request,$response,$args);
})->add($authMiddleware);

$app->run();
