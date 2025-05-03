<?php

namespace App\Controllers;

use App\Models\Carta;
use App\Models\Jugada as JugadaModel;
use App\Models\MazoCarta;
use App\Models\Partida;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class JuegoController
{
    private $mazoCartaModel;
    private $jugadaModel;
    private $partidaModel;
    private $cartaModel;

    public function __construct(
        MazoCarta $mazoCartaModel,
        JugadaModel $jugadaModel,
        Partida $partidaModel,
        Carta $cartaModel
    ) {
        $this->mazoCartaModel = $mazoCartaModel;
        $this->jugadaModel = $jugadaModel;
        $this->partidaModel = $partidaModel;
        $this->cartaModel = $cartaModel;
    }

    private function jugadaServidor(): ?int
    {
        /*// Obtengo las cartas del server
        $cartasEnManoServidor = $this->mazoCartaModel->obtenerCartasEnManoPorMazo($mazoIdServidor);

        if (empty($cartasEnManoServidor)) {
            return null; // El servidor no tiene cartas en mano
        }

        // Eligo una carta aleatoria de las cartas en mano
        $indiceAleatorio = array_rand($cartasEnManoServidor);
        $cartaJugadaInfo = $cartasEnManoServidor[$indiceAleatorio];
        $cartaIdServidor = $cartaJugadaInfo['carta_id'];

        // Actualizar el estado de la carta a "descartado"
        $mazoCartaServidor = $this->mazoCartaModel->obtenerCartaEnManoPorCartaIdMazoId($cartaIdServidor, $mazoIdServidor);
        if ($mazoCartaServidor) {
            $this->mazoCartaModel->actualizarEstadoCarta($mazoCartaServidor['id'], 'descartado');
            return $cartaIdServidor;
        }

        return null; // No se encontró la carta en mano para descartar*/
        
        // Obtengo las cartas del server
        $mazoIdServidor =  1;
        $cartasEnManoServidor = $this->mazoCartaModel->obtenerCartasEnManoPorMazo($mazoIdServidor);

        if (empty($cartasEnManoServidor)) {
            return null; // El servidor no tiene cartas en mano
        }

        // Eligo una carta aleatoria de las cartas en mano
        $indiceAleatorio = array_rand($cartasEnManoServidor);
        $cartaJugadaInfo = $cartasEnManoServidor[$indiceAleatorio];

        // Actualizar el estado de la carta a "descartado"
        $this->mazoCartaModel->actualizarEstadoCarta($cartaJugadaInfo['id'], 'descartado');
        
        // Devuelvo la carta elegida aleatoriamente
        return $cartaJugadaInfo['carta_id'];
    }

    public function realizarJugada(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user')['id'];
            $data = $request->getParsedBody();
            $cartaJugadaUsuarioId = $data['carta_jugada'] ?? null;
            $partidaId = $data['id_partida'] ?? null;

            // Validar los datos necesarios
            if (!$cartaJugadaUsuarioId || !$partidaId) {
                $error = ['error' => 'Se deben proporcionar la carta jugada y el ID de la partida.'];
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Obtener información de la partida
            $partida = $this->partidaModel->obtenerPartidaPorIdYUsuario($partidaId, $userId);
            if (!$partida || $partida['estado'] !== 'en_curso') {
                $error = ['error' => 'La partida no existe o no está en curso.'];
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $mazoIdUsuario = $partida['mazo_id'];
            $mazoIdServidor = 1; // ID del mazo del servidor

            // Verificar si la carta del usuario está en su mano
            $cartaEnManoUsuario = $this->mazoCartaModel->obtenerCartaEnManoPorCartaIdMazoId($cartaJugadaUsuarioId, $mazoIdUsuario);
            if (!$cartaEnManoUsuario) {
                $error = ['error' => 'La carta jugada no está en tu mazo o ya la utilizaste, intenta con otra carta.'];
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Obtener la jugada del servidor (y marcar su carta como descartada)
            $cartaIdServidor = $this->jugadaServidor($partidaId, $mazoIdServidor);

            if ($cartaIdServidor !== null) {
                // Determinar el ganador de la jugada ANTES de registrarla
                $resultadoJugadaInfo = $this->determinarGanadorJugada($cartaJugadaUsuarioId, $cartaIdServidor);

                // Registrar la jugada del usuario y del servidor con el resultado
                $this->jugadaModel->registrarJugada($partidaId, $cartaJugadaUsuarioId, $cartaIdServidor, $resultadoJugadaInfo['resultado']);
                $this->mazoCartaModel->actualizarEstadoCarta($cartaEnManoUsuario['id'], 'descartado');
            
                // Verificar si es la quinta jugada
                $numeroJugada = $this->jugadaModel->obtenerNumeroJugadas($partidaId);
                $ganadorJuego = null;
                if ($numeroJugada == 5) {
                    $ganadorJuego = $this->determinarGanadorJuego($partidaId, $userId);
                    $this->partidaModel->actualizarGanadorPartida($partidaId, $ganadorJuego);

                    // Actualizar el estado de las cartas descartadas del usuario y el servidor ('descartado'=>'en_mazo')
                    $this->mazoCartaModel->resetearEstadoMazo($mazoIdUsuario);
                    $this->mazoCartaModel->resetearEstadoMazo($mazoIdServidor); 
                }

                $dataRespuesta = [
                    'carta_servidor' => $cartaIdServidor,
                    'ataque_usuario' => $resultadoJugadaInfo['ataque_usuario'],
                    'ataque_servidor' => $resultadoJugadaInfo['ataque_servidor'],
                    'resultado_jugada' => $resultadoJugadaInfo['resultado'],
                ];
                if ($ganadorJuego) {
                    $dataRespuesta['ganador_juego'] = $ganadorJuego;
                }

                $response->getBody()->write(json_encode($dataRespuesta));
                return $response->withStatus(200)->withHeader('Content-Type', 'application/json');

            } else {
                $error = ['error' => 'El servidor no pudo realizar una jugada.'];
                $response->getBody()->write(json_encode($error));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

        } catch (\PDOException $e) {
            error_log("Error de base de datos al realizar jugada: " . $e->getMessage());
            $error = ['error' => 'Error interno del servidor al realizar la jugada. Por favor, inténtelo de nuevo más tarde.'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Error general al realizar jugada: " . $e->getMessage());
            $error = ['error' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /*private function determinarGanadorJugada(int $cartaUsuarioId, int $cartaServidorId): string
    {
        $cartaUsuario = $this->cartaModel->obtenerCartaPorId($cartaUsuarioId);
        $cartaServidor = $this->cartaModel->obtenerCartaPorId($cartaServidorId);

        $ataqueUsuario = $cartaUsuario['ataque'];
        $atributoUsuarioId = $cartaUsuario['atributo_id'];
        $ataqueServidor = $cartaServidor['ataque'];
        $atributoServidorId = $cartaServidor['atributo_id'];
        

        // Aplicar el bono de ataque por atributo
        if ($this->cartaModel->verificaGanadorAtributo($atributoUsuarioId, $atributoServidorId)){
            $ataqueUsuario *= 1.30; // +30% al ataque del usuario
        } elseif ($this->cartaModel->verificaGanadorAtributo($atributoServidorId, $atributoUsuarioId)) {
            $ataqueServidor *= 1.30; // +30% al ataque del servidor
        }

        // Comparar los ataques
        if ($ataqueUsuario > $ataqueServidor) {
            return 'gano';
        } elseif ($ataqueUsuario < $ataqueServidor) {
            return 'perdio';
        } else {
            return 'empato';
        }
    }*/

    private function determinarGanadorJugada(int $cartaUsuarioId, int $cartaServidorId): array
    {
        $cartaUsuario = $this->cartaModel->obtenerCartaPorId($cartaUsuarioId);
        $cartaServidor = $this->cartaModel->obtenerCartaPorId($cartaServidorId);

        $ataqueUsuario = $cartaUsuario['ataque'];
        $atributoUsuarioId = $cartaUsuario['atributo_id'];
        $ataqueServidor = $cartaServidor['ataque'];
        $atributoServidorId = $cartaServidor['atributo_id'];

        // Aplicar el bono de ataque por atributo
        if ($this->cartaModel->verificaGanadorAtributo($atributoUsuarioId, $atributoServidorId)){
            $ataqueUsuario *= 1.30; // +30% al ataque del usuario
        } elseif ($this->cartaModel->verificaGanadorAtributo($atributoServidorId, $atributoUsuarioId)) {
            $ataqueServidor *= 1.30; // +30% al ataque del servidor
        }

        $resultado = '';
        // Comparar los ataques
        if ($ataqueUsuario > $ataqueServidor) {
            $resultado = 'gano';
        } elseif ($ataqueUsuario < $ataqueServidor) {
            $resultado = 'perdio';
        } else {
            $resultado = 'empato';
        }

        return [
            'resultado' => $resultado,
            'ataque_usuario' => round($ataqueUsuario, 2), // Redondear a 2 decimales para mejor presentación
            'ataque_servidor' => round($ataqueServidor, 2), // Redondear a 2 decimales para mejor presentación
        ];
    }

    private function determinarGanadorJuego(int $partidaId, int $usuarioId): ?string
    {
        $jugadas = $this->jugadaModel->obtenerJugadasPorPartida($partidaId);
        $ganadasUsuario = 0;
        $ganadasServidor = 0;

        //NECESARIAS LA VALIDACIONES $jugada['carta_id_a'] !== null?
        foreach ($jugadas as $jugada) {
            if ($jugada['el_usuario'] === 'gano') {
                $ganadasUsuario++;
            } elseif ($jugada['el_usuario'] === 'perdio') {
                $ganadasServidor++;
            }
        }

        if ($ganadasUsuario > $ganadasServidor) {
            return 'gano';
        } elseif ($ganadasServidor > $ganadasUsuario) {
            return 'perdio';
        } else {
            return 'empato';
        }
    }
}