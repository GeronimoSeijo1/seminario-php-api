import { useState } from "react";
import { loginUser } from '../../services/apiServices.js';
import { useNavigate } from "react-router-dom";
import Layout from '../../layout/Layout.jsx';
import '../../assets/styles/Forms.css'; // Mantenemos tu CSS personalizado

import { getUserId, getUsername, isAuthenticated } from "../../utils/auth";

function LoginPage() {
    const [errores, setErrores] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            usuario: e.target[0].value,
            password: e.target[1].value
        };

        const erroresDetectados = [];

        if (!data.usuario.trim()) {
            erroresDetectados.push("El nombre de usuario es obligatorio.");
        }
        if (!data.password.trim()) {
            erroresDetectados.push("La contraseña es obligatoria.");
        }

        if (erroresDetectados.length > 0) {
            setErrores(erroresDetectados);
            return;
        }

        try {
            const login = await loginUser(data);

            localStorage.setItem("token", login.data.token); 
            localStorage.setItem("id", getUserId());
            localStorage.setItem("usuario", getUsername());

            console.log(localStorage);
            
            // Reemplazamos alert() con una lógica de UI de mensaje, como se recomienda.
            // Para este ejemplo, solo un console.log, pero en una app real usarías un modal o un toast.
            console.log("Usuario logueado"); // alert("Usuario logueado");
            setErrores([]);
            navigate("/");
        } catch (error) {
            if (error.response?.data?.error) {
                setErrores([error.response.data.error]);
            } else {
                setErrores(["Error al iniciar sesión."]);
            }
        }
    };

    // Función para manejar el clic del botón "Volver al Inicio"
    const handleGoBack = () => {
        navigate("/"); // Navega a la ruta raíz (inicio)
    };

    return (
        <Layout>
            {/* Contenedor principal: d-flex para centrar, min-vh-100 para altura completa de la vista */}
            {/* y py-5 para padding vertical */}
            <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
                {/* 'left' ahora será una 'card' o un div con estilos personalizados */}
                {/* p-4 para padding, rounded para bordes redondeados, shadow-lg para una sombra grande */}
                {/* mx-auto para centrar en anchos mayores, col-12 col-md-8 col-lg-6 para responsividad */}
                <div className="left p-4 rounded shadow-lg mx-auto col-12 col-md-8 col-lg-6">
                    {errores.length > 0 && (
                        // Componente de alerta de Bootstrap para errores
                        <div className="alert alert-danger" role="alert">
                            <ul className="mb-0 ps-3"> {/* mb-0 quita margen inferior, ps-3 añade padding a la izquierda */}
                                {errores.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* h2 con clase 'text-center' de Bootstrap */}
                    <h2 className="title text-center mb-4">Por favor, inicia sesion</h2> {/* mb-4 para margen inferior */}

                    {/* form con g-3 para espaciado de grid, y noValidate para deshabilitar validación HTML5 por defecto por si la manejas con JS */}
                    <form className='form needs-validation' onSubmit={handleSubmit} noValidate>
                        {/* Campo de Usuario */}
                        <div className="mb-3"> {/* mb-3 para margen inferior */}
                            <label htmlFor="usuarioInput" className="form-label">USUARIO</label>
                            {/* form-control para el estilo de input de Bootstrap */}
                            <input
                                type="text"
                                className="form-control"
                                id="usuarioInput"
                                name="usuario"
                                placeholder="Ingresa tu usuario" // Placeholder para mejor UX
                                required // Atributo HTML5 para validación básica (aunque tu JS la maneja)
                            />
                        </div>

                        {/* Campo de Contraseña */}
                        <div className="mb-4"> {/* mb-4 para margen inferior, un poco más para separar del botón */}
                            <label htmlFor="passwordInput" className="form-label">CONTRASEÑA</label>
                            {/* form-control para el estilo de input de Bootstrap */}
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                name="password"
                                placeholder="Ingresa tu contraseña"
                                required
                            />
                        </div>

                        {/* Contenedor para los botones con display flex para que estén lado a lado */}
                        {/* d-flex para flexbox, justify-content-between para espacio entre ellos, gap-2 para espacio entre botones */}
                        {/* flex-column flex-md-row para que se apilen en móviles y se pongan en fila en escritorio */}
                        <div className="d-flex justify-content-between gap-2 flex-column flex-md-row mt-3">
                            {/* Botón de Login */}
                            <button type="submit" className="btn btn-primary flex-grow-1">Iniciar sesion</button>
                            {/* Botón Volver al Inicio */}
                            {/* btn-outline-secondary-custom es una clase personalizada para este botón */}
                            <button type="button" className="btn btn-outline-secondary-custom flex-grow-1" onClick={handleGoBack}>
                                Volver al inicio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default LoginPage;
