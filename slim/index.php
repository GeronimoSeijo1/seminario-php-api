<?php
date_default_timezone_set('America/Argentina/Buenos_Aires');

use App\Controllers\Auth\AuthController;
use App\Controllers\UserController;
use App\Middleware\AuthMiddleware;
use App\Models\User;
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

//$app->post('/usuarios/registro', [UserController::class, 'registro']);
$app->post('/usuarios/registro', function ($request, $response) use ($userController) {
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

$app->run();