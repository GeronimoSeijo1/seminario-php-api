import { useEffect, useState } from "react";
import { getUserMazos , getCartasDeMazo, editarNombreMazo, eliminarMazo} from '../../services/apiServices.js';
import { Link } from "react-router-dom";
import Layout from '../../layout/Layout.jsx';
import '../../assets/styles/MisMazos.css';
import Modal from "../../components/Modal.jsx";

function MisMazosPage() {
    
    //Variables para controlar el login
    const userId =  localStorage.getItem("id");
    const token = localStorage.getItem("token");

    //Estados para controlar el modal
    const [mazoSeleccionado, setMazoSeleccionado] = useState(null);
    const [cartas, setCartas] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    //Estado para controlar el mazo
    const [mazos, setMazos] = useState([]);

    //Estados para editar nombre
    const [nuevosNombres, setNuevosNombres] = useState({});

    //Para errores en el nombre
    const [erroresNombre, setErroresNombre] = useState({});

    const verMazo = async (mazoId) => {
        try{
            const res = await getCartasDeMazo(userId, mazoId, token);
            setCartas(res.data.cartas);
            console.log("Cartas del mazo:", res.data.cartas);
            setMazoSeleccionado(mazoId);
            setMostrarModal(true);
        } catch (error) {
            console.error("Error al obtener cartas del mazo:", error);
        }
    };

    const editarNombre = async (mazoId) => {
        const nuevoNombre = nuevosNombres[mazoId]?.trim();

        if(!nuevoNombre){
            setErroresNombre({ ...erroresNombre, [mazoId]: "El nombre no puede estar vacío" });
            return;
        }

        if (nuevoNombre.length > 30) {
            setErroresNombre({ ...erroresNombre, [mazoId]: "El nombre no puede tener más de 30 caracteres" });
            setNuevosNombres({ ...nuevosNombres, [mazoId]: "" });
            return;
        }

          try {
            await editarNombreMazo(mazoId, nuevoNombre, token);
            alert("Nombre actualizado correctamente");

            // Volver a cargar los mazos para reflejar el cambio
            const res = await getUserMazos(userId, token);
            setMazos(res.data["lista de mazos del usuario logueado"]);

            // Limpiar el input y error
            setNuevosNombres({ ...nuevosNombres, [mazoId]: "" });
            setErroresNombre({ ...erroresNombre, [mazoId]: null });
        } catch (error) {
            console.error("Error al editar el nombre del mazo:", error);
            alert("No se pudo actualizar el nombre del mazo");
        }
    };

    const eliminar = async (mazoId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este mazo?")) return;
        try {
            await eliminarMazo(mazoId, token);
            alert("Mazo eliminado correctamente.");

            // Refrescar lista
            const res = await getUserMazos(userId, token);
            setMazos(res.data["lista de mazos del usuario logueado"]);
        } catch (error) {
            console.error("Error al eliminar el mazo:", error);
            const msg = error.response?.data?.error || "No se pudo eliminar el mazo.";
            alert(msg);
        }
    };

    //useEffect() cuando quiero que algo se ejecute automáticamente
    useEffect(() => {
        const cargarMazos = async () => {
            try {
                const res = await getUserMazos(userId, token);
                setMazos(res.data["lista de mazos del usuario logueado"]);
            } catch (error) {
                if (error.response?.status === 400) {
                    setMazos([]); // lo tratamos como "sin mazos"
                } else {
                    console.error("Error al cargar los mazos:", error);
                }
            }
        };

        cargarMazos();
    }, [userId, token]);

    return (
        <>
        <Layout>
            <div className="container mis-mazos-container d-flex justify-content-center">
                <div className="leaderboard-card w-100" style={{ maxWidth: '900px' }}>
                <div className="leaderboard-header">MIS MAZOS</div>

                {mazos.length === 0 && (
                    <p className="sin-mazos">Aún no tenes asignado ningún mazo</p>
                )}


                {mazos.length > 0 && (
                <div>
                    <div className="leaderboard-row header static-header">
                        <div>MAZO</div>
                        <div>ACCIONES</div>
                        <div>NUEVO NOMBRE</div>   
                        <div>JUGAR</div>
                    </div>

                    {mazos.map((mazo) => (
                    <div key={mazo.id} className="leaderboard-row">
                        <div>{mazo.nombre} </div>
                        <div  className="acciones">
                            <button className="btn" onClick={() => verMazo(mazo.id)}>Ver mazo</button>
                            <button className="btn" onClick={() => eliminar(mazo.id)}>Eliminar</button>
                            <button className="btn" onClick={() => editarNombre(mazo.id)}>Editar</button>
                        </div>
                        <div>
                            <input 
                                type="text" 
                                placeholder="Nuevo nombre" 
                                className="input" 
                                value={nuevosNombres[mazo.id] || ""}
                                onChange={(e) => setNuevosNombres({...nuevosNombres, [mazo.id]: e.target.value})}
                            />
                            {erroresNombre[mazo.id] && (
                                <p className="error-mensaje">{erroresNombre[mazo.id]}</p>
                            )}
                        </div>
                        <div>
                            <Link to={`/jugar/${mazo.id}`} className="btn">
                                Jugar
                            </Link>
                        </div>
                    </div>
                    ))}
                </div>
                )}
                    <button 
                        className="btn alta" 
                        disabled={mazos.length >= 3}
                        onClick={() => window.location.href = "/crear-mazo"} 
                    >
                        Alta de nuevo mazo
                    </button>

                </div>
            </div>


        </Layout>
        
        {mostrarModal && (
        <Modal title={`CARTAS DEL MAZO`} onClose={() => setMostrarModal(false)}>
            <div className="cartas-contenedor">
                {cartas.map((carta, index) => (
                    <div className="carta-item" key={index}>
                        <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${carta.id}.png`}
                        alt={carta.nombre}
                        className="carta-img"
                        onError={(e) => (e.target.src = "/img/placeholder.png")}
                        />
                        <div className="carta-nombre">
                            {carta.nombre}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
        )}
        </>
    );
}

export default MisMazosPage;