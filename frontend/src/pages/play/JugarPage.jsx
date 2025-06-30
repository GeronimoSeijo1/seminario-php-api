// src/pages/jugar/JugarPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderComponent from '../../components/HeaderComponent';
import NavBarComponent from '../../components/NavBarComponent';
import FooterComponent from '../../components/FooterComponent';
import CardComponent from '../../components/play/CardComponent';
// Importa las funciones actualizadas del apiServices.js
// SE ELIMINA 'abandonarPartida as abandonarPartidaApi' DE AQUÍ
import { iniciarPartida, realizarJugada, obtenerCartasEnManoUsuario, obtenerCartasEnManoServidor } from '../../services/apiServices'; 
import '../../assets/styles/play/JugarPage.css';

const JugarPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mazoId: navigatedMazoId } = location.state || {};

    const hardcodedMazoId = '11'; // ID de mazo de ejemplo. Asegúrate que exista en tu BD y pertenezca al usuario.
    const mazoIdToUse = navigatedMazoId || hardcodedMazoId;

    const [partidaId, setPartidaId] = useState(null);
    const [cartasJugador, setCartasJugador] = useState([]);
    // Ahora mantenemos un estado para el *número* de cartas del servidor, no solo las visibles.
    const [cartasServidorRestantes, setCartasServidorRestantes] = useState(0); 
    const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
    const [cartaJugadaUsuario, setCartaJugadaUsuario] = useState(null);
    const [cartaJugadaServidor, setCartaJugadaServidor] = useState(null);
    const [mensajeResultadoJugada, setMensajeResultadoJugada] = useState('');
    const [ganadorJuego, setGanadorJuego] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const setupGame = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const idUsuario = localStorage.getItem('userId'); // Asume que guardas el userId al loguear

            if (!token || !idUsuario) { // Ahora verificamos userId
                console.error('No se encontró el token o ID de usuario en localStorage.');
                alert('No estás autenticado. Por favor, loguéate y guarda el token/ID de usuario.');
                navigate('/login');
                return;
            }

            let currentPartidaId = localStorage.getItem('partidaId');

            // --- Intento de Reanudar Partida ---
            if (currentPartidaId) {
                try {
                    console.log(`Intentando reanudar partida ${currentPartidaId} para usuario ${idUsuario}...`);
                    const resUsuario = await obtenerCartasEnManoUsuario(idUsuario, currentPartidaId, token);
                    setCartasJugador(resUsuario.data.cartas);

                    const resServidor = await obtenerCartasEnManoServidor('1', currentPartidaId, token);
                    setCartasServidorRestantes(resServidor.data.cartas.length);

                    setPartidaId(currentPartidaId);
                    setCartaSeleccionada(null);
                    setCartaJugadaUsuario(null);
                    setCartaJugadaServidor(null);
                    setMensajeResultadoJugada('');
                    setGanadorJuego(null);

                    console.log(`Partida ${currentPartidaId} reanudada. Cartas usuario: ${resUsuario.data.cartas.length}, Cartas servidor: ${resServidor.data.cartas.length}`);
                    setIsLoading(false);
                    return;
                } catch (error) {
                    console.error('Error al intentar reanudar partida existente:', error);
                    localStorage.removeItem('partidaId');
                    alert('La partida anterior no pudo ser reanudada o ya ha terminado. Se intentará iniciar una nueva.');
                }
            }

            // --- Iniciar Nueva Partida (si no se pudo reanudar o no había una guardada) ---
            if (!mazoIdToUse) {
                console.error('No se recibió el ID del mazo para iniciar la partida.');
                alert('No se pudo encontrar un mazo para iniciar la partida. Redirigiendo a Mis Mazos.');
                navigate('/mis-mazos');
                setIsLoading(false);
                return;
            }

            try {
                const response = await iniciarPartida(mazoIdToUse, token);
                const newPartidaId = response.data.id_partida;
                setPartidaId(newPartidaId);
                setCartasJugador(response.data.cartas);
                setCartasServidorRestantes(5);

                localStorage.setItem('partidaId', newPartidaId);

                setCartaSeleccionada(null);
                setCartaJugadaUsuario(null);
                setCartaJugadaServidor(null);
                setMensajeResultadoJugada('');
                setGanadorJuego(null);
                console.log(`Nueva partida ${newPartidaId} iniciada.`);

            } catch (error) {
                console.error('Error al iniciar la partida:', error.response?.data?.error || error.message);
                if (error.response && error.response.status === 409) {
                    alert('Ya tienes una partida en curso en el servidor. Por favor, recarga la página para intentar reanudarla.');
                } else if (error.response && error.response.status === 401) {
                    alert('Sesión expirada o no autorizada. Por favor, vuelve a iniciar sesión.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('partidaId');
                    navigate('/login');
                } else {
                    alert(`Error al iniciar la partida: ${error.message || 'Error desconocido'}`);
                    navigate('/mis-mazos');
                }
            } finally {
                setIsLoading(false);
            }
        };

        setupGame();
    }, [mazoIdToUse, navigate]);

    const handleSelectCard = (carta) => {
        if (cartaJugadaUsuario || ganadorJuego) return;
        setCartaSeleccionada(carta);
    };

    const handlePlayCard = async () => {
        if (!cartaSeleccionada || !partidaId) {
            alert('Por favor, selecciona una carta y asegúrate de que la partida haya iniciado.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró el token en localStorage para realizar la jugada.');
            alert('No estás autenticado. Por favor, loguéate y guarda el token.');
            navigate('/login');
            return;
        }

        console.log('DEBUG: Valores enviados a realizarJugada:');
        console.log('partidaId:', partidaId, 'Tipo:', typeof partidaId);
        console.log('cartaSeleccionada:', cartaSeleccionada);
        console.log('cartaSeleccionada.numero_carta:', cartaSeleccionada ? cartaSeleccionada.numero_carta : 'N/A', 'Tipo:', typeof (cartaSeleccionada ? cartaSeleccionada.numero_carta : null));

        try {
            const response = await realizarJugada(partidaId, cartaSeleccionada.numero_carta, token);
            console.log('Jugada exitosa. Respuesta del servidor:', response.data);

            setCartaJugadaUsuario(cartaSeleccionada);
            setCartaJugadaServidor(response.data.carta_servidor);
            setMensajeResultadoJugada(`Resultado: ${response.data.resultado_jugada} (Tu Ataque: ${response.data.ataque_usuario} vs Servidor: ${response.data.ataque_servidor})`);

            setCartasJugador(prevCartas =>
                prevCartas.map(c =>
                    c.id === cartaSeleccionada.id ? { ...c, estado: 'descartado' } : c
                )
            );

            setCartasServidorRestantes(prev => prev - 1);

            if (response.data.ganador_juego && response.data.ganador_juego !== "Partida en curso") {
                setGanadorJuego(response.data.ganador_juego);
                localStorage.removeItem('partidaId');
            }

            setCartaSeleccionada(null);

            setTimeout(() => {
                setCartaJugadaUsuario(null);
                setCartaJugadaServidor(null);
                setMensajeResultadoJugada('');
            }, 2000);

        } catch (error) {
            console.error('Error al realizar la jugada:', error);
            if (error.response && error.response.status === 401) {
                alert('Sesión expirada o no autorizada. Por favor, vuelve a iniciar sesión.');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('partidaId');
                navigate('/login');
            } else {
                alert(`Error al realizar la jugada: ${error.response?.data?.error || error.message || 'Error desconocido'}`);
            }
        }
    };

    const handleRestartGame = () => {
        localStorage.removeItem('partidaId');
        navigate('/mis-mazos');
    };

    // SE ELIMINA LA FUNCIÓN handleAbandonGame COMPLETA

    return (
        <div className="jugar-page-container">
            <HeaderComponent />
            <div className="jugar-content">
                <h1>Partida en Curso</h1>

                {isLoading ? (
                    <p>Cargando partida...</p>
                ) : partidaId ? (
                    <>
                        <div className="board-container">
                            <div className="server-cards-area">
                                <h2>Cartas del Servidor ({cartasServidorRestantes} restantes)</h2>
                                <div className="server-cards-row">
                                    {Array.from({ length: cartasServidorRestantes }).map((_, index) => (
                                        <CardComponent
                                            key={`server-remaining-${index}`}
                                            carta={{ nombre: 'Carta Oculta', atributo: '?', ataque: '?' }}
                                            isPlayable={false}
                                            isSelected={false}
                                            onClick={() => {}}
                                            isServerCard={true}
                                        />
                                    ))}
                                    {cartaJugadaServidor && (
                                        <CardComponent
                                            key="server-played-card"
                                            carta={cartaJugadaServidor}
                                            isPlayable={false}
                                            isSelected={false}
                                            isServerCard={true}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="play-area">
                                {cartaJugadaUsuario && cartaJugadaServidor ? (
                                    <div className="played-cards-display">
                                        <div className="played-card user-played">
                                            <h3>Tu Carta:</h3>
                                            <CardComponent carta={cartaJugadaUsuario} isPlayable={false} isSelected={false} onClick={() => {}} />
                                        </div>
                                        <div className="played-card server-played">
                                            <h3>Carta Servidor:</h3>
                                            <CardComponent carta={cartaJugadaServidor} isPlayable={false} isSelected={false} />
                                        </div>
                                    </div>
                                ) : (
                                    <p>Selecciona una carta para jugar</p>
                                )}
                                {mensajeResultadoJugada && <p className="result-message">{mensajeResultadoJugada}</p>}
                                {ganadorJuego && (
                                    <div className="game-over-message">
                                        <h2>¡Partida Finalizada!</h2>
                                        <h3>Ganador del juego: {ganadorJuego}</h3>
                                        <button onClick={handleRestartGame} className="btn btn-primary">Jugar otra vez?</button>
                                    </div>
                                )}
                                {cartaSeleccionada && !cartaJugadaUsuario && !ganadorJuego && (
                                    <button onClick={handlePlayCard} className="btn btn-success play-button">
                                        Jugar {cartaSeleccionada.nombre}
                                    </button>
                                )}
                            </div>

                            <div className="player-cards-area">
                                <h2>Tus Cartas ({cartasJugador.filter(c => c.estado !== 'descartado').length} restantes)</h2>
                                <div className="player-cards-row">
                                    {cartasJugador.map((carta) => (
                                        <CardComponent
                                            key={carta.id}
                                            carta={carta}
                                            isPlayable={carta.estado !== 'descartado' && !cartaJugadaUsuario && !ganadorJuego}
                                            isSelected={cartaSeleccionada && cartaSeleccionada.id === carta.id}
                                            onClick={() => handleSelectCard(carta)}
                                            className={carta.estado === 'descartado' ? 'descartado' : ''}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* SE ELIMINA EL BOTÓN DE ABANDONAR PARTIDA COMPLETO */}
                        {/* {!ganadorJuego && (
                            <button onClick={handleAbandonGame} className="btn btn-danger mt-3">
                                Abandonar Partida
                            </button>
                        )} */}
                    </>
                ) : (
                    <p>No se pudo iniciar/reanudar la partida. Asegúrate de tener un mazo seleccionado y un token válido.</p>
                )}
            </div>
            <FooterComponent />
        </div>
    );
};

export default JugarPage;