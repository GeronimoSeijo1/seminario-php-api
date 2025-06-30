import { useState } from "react";
import { registerUser } from '../../services/apiServices.js';
import { useNavigate } from "react-router-dom";
import Layout from '../../layout/Layout.jsx';
import '../../assets/styles/Forms.css'; // Mantenemos tu CSS personalizado

function RegistroPage() {
    const [errores, setErrores] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombre = e.target[0].value.trim();
        const usuario = e.target[1].value.trim();
        const password = e.target[2].value;

        const nuevosErrores = [];

        if (!nombre) {
            nuevosErrores.push("El nombre no puede estar vacío.");
        } else if (nombre.length > 30) {
            nuevosErrores.push("El nombre no puede tener más de 30 caracteres.");
        }

        if (!usuario) {
            nuevosErrores.push("El nombre de usuario no puede estar vacío.");
        } else {
            if (usuario.length < 6 || usuario.length > 20) {
                nuevosErrores.push("El nombre de usuario debe tener entre 6 y 20 caracteres.");
            }
            if (!/^[a-zA-Z0-9]+$/.test(usuario)) {
                nuevosErrores.push("El nombre de usuario solo puede contener letras y números.");
            }
        }

        if (password.length < 8) {
            nuevosErrores.push("La contraseña debe tener al menos 8 caracteres.");
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/\\|]).{8,}/.test(password)) {
            nuevosErrores.push("La contraseña debe tener mayúsculas, minúsculas, números y caracteres especiales.");
        }

        if (nuevosErrores.length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        const data = { nombre, usuario, password };

        try {
            await registerUser(data);
            // Reemplazamos alert() con una lógica de UI de mensaje, como se recomienda.
            console.log("Usuario registrado con éxito"); // alert("Usuario registrado con éxito");
            setErrores([]);
            navigate("/login"); 
        } catch (error) {
            if (error.response?.data?.error) {
                setErrores([error.response.data.error]);
            } else {
                setErrores(["Error al registrar el usuario."]);
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
                    <h2 className="title text-center mb-4">REGISTRAR USUARIO</h2> {/* mb-4 para margen inferior */}

                    {/* form con g-3 para espaciado de grid, y noValidate para deshabilitar validación HTML5 por defecto si la manejas con JS */}
                    <form className='form needs-validation' onSubmit={handleSubmit} noValidate>
                        {/* Campo de Nombre */}
                        <div className="mb-3"> {/* mb-3 para margen inferior */}
                            <label htmlFor="nombreInput" className="form-label">Ingresa tu nombre</label>
                            {/* form-control para el estilo de input de Bootstrap */}
                            <input
                                type="text"
                                className="form-control"
                                id="nombreInput"
                                name="nombre"
                                placeholder="Tu nombre completo"
                                required
                            />
                        </div>

                        {/* Campo de Usuario */}
                        <div className="mb-3"> {/* mb-3 para margen inferior */}
                            <label htmlFor="usuarioInput" className="form-label">Ingresa nombre de usuario</label>
                            {/* form-control para el estilo de input de Bootstrap */}
                            <input
                                type="text"
                                className="form-control"
                                id="usuarioInput"
                                name="usuario"
                                placeholder="Nombre de usuario"
                                required
                            />
                        </div>

                        {/* Campo de Contraseña */}
                        <div className="mb-4"> {/* mb-4 para margen inferior, un poco más para separar del botón */}
                            <label htmlFor="passwordInput" className="form-label">Ingresa contraseña</label>
                            {/* form-control para el estilo de input de Bootstrap */}
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                name="password"
                                placeholder="Contraseña"
                                required
                            />
                        </div>

                        {/* Contenedor para los botones con display flex para que estén lado a lado */}
                        {/* d-flex para flexbox, justify-content-between para espacio entre ellos, gap-2 para espacio entre botones */}
                        {/* flex-column flex-md-row para que se apilen en móviles y se pongan en fila en escritorio */}
                        <div className="d-flex justify-content-between gap-2 flex-column flex-md-row mt-3">
                            {/* Botón de Registro */}
                            <button type="submit" className="btn btn-primary flex-grow-1">Registrarme</button>
                            {/* Botón Volver al Inicio */}
                            {/* btn-outline-secondary-custom es una clase personalizada para este botón */}
                            <button type="button" className="btn btn-outline-secondary-custom flex-grow-1" onClick={handleGoBack}>
                                Volver al Inicio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default RegistroPage;
