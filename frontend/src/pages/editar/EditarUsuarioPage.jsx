import { useState, useEffect } from "react";
import { editUser } from '../../services/apiServices.js';
import Layout from '../../layout/Layout.jsx';
import '../../assets/styles/Forms.css'; // Mantenemos tu CSS personalizado
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para el botón "Volver al Inicio"

function EditarUsuarioPage() {
    const [errores, setErrores] = useState([]);
    const navigate = useNavigate(); // Inicializamos useNavigate

    // Puedes usar useEffect para cargar datos iniciales del usuario si es necesario
    // Por ejemplo, para pre-rellenar el campo de nombre.
    // useEffect(() => {
    //     const storedUserName = localStorage.getItem("usuario");
    //     if (storedUserName) {
    //         // Aquí podrías establecer el valor inicial del input de nombre
    //         // Necesitarías un estado para el nombre del input y un ref o controlarlo
    //         // de forma controlada si quieres que se muestre el nombre actual.
    //     }
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombre = e.target[0].value.trim();
        const password = e.target[1].value;
        const passwordRep = e.target[2].value;

        const nuevosErrores = [];

        if (!nombre) {
            nuevosErrores.push("El nombre no puede estar vacío.");
        } else if (nombre.length > 30) {
            nuevosErrores.push("El nombre no puede tener más de 30 caracteres.");
        }

        if (password.length < 8) {
            nuevosErrores.push("La contraseña debe tener al menos 8 caracteres.");
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/\\|]).{8,}/.test(password)) {
            nuevosErrores.push("La contraseña debe tener mayúsculas, minúsculas, números y caracteres especiales.");
        }

        if (password !== passwordRep) {
            nuevosErrores.push("Las contraseñas no coinciden");
        }

        if (nuevosErrores.length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");
        const data = { nombre, password };

        try {
            await editUser(userId, data, token);
            // Reemplazamos alert() con una lógica de UI de mensaje, como se recomienda.
            console.log("Perfil actualizado con éxito"); // alert("Perfil actualizado con éxito");
            setErrores([]);
            // Opcional: navegar a otra página después de la edición exitosa
            // navigate("/perfil"); 
        } catch (error) {
            if (error.response?.data?.error) {
                setErrores([error.response.data.error]);
            } else {
                setErrores(["Error al actualizar el usuario."]);
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
            <div className="container d-flex justify-content-center align-items-center min-vh-100 py-2">
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
                    <h2 className="title text-center mb-4">EDITAR USUARIO</h2> {/* mb-4 para margen inferior */}

                    {/* form con g-3 para espaciado de grid, y noValidate para deshabilitar validación HTML5 por defecto si la manejas con JS */}
                    <form className='form needs-validation' onSubmit={handleSubmit} noValidate>
                        {/* Campo de Nombre */}
                        <div className="mb-3"> {/* mb-3 para margen inferior */}
                            <label htmlFor="nombreInput" className="form-label">Ingresa tu nombre</label>
                            {/* form-control para el estilo de input de Bootstrap */}
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                placeholder="Tu nuevo nombre"
                            />
                        </div>

                        {/* Campo de Contraseña */}
                        <div className="mb-3"> {/* mb-3 para margen inferior */}
                            <label htmlFor="passwordInput" className="form-label">Ingresa nueva contraseña</label>
                            {/* form-control para el estilo de input de Bootstrap */}
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Nueva contraseña"
                            />
                        </div>

                        {/* Campo de Repetir Contraseña */}
                        <div className="mb-4"> {/* mb-4 para margen inferior, un poco más para separar del botón */}
                            <label htmlFor="passwordRepInput" className="form-label">Repetir contraseña</label>
                            {/* form-control para el estilo de input de Bootstrap */}
                            <input
                                type="password"
                                className="form-control"
                                name="passwordRep"
                                placeholder="Repite la nueva contraseña"
                            />
                        </div>

                        {/* Contenedor para los botones con display flex para que estén lado a lado */}
                        {/* d-flex para flexbox, justify-content-between para espacio entre ellos, gap-2 para espacio entre botones */}
                        {/* flex-column flex-md-row para que se apilen en móviles y se pongan en fila en escritorio */}
                        <div className="d-flex justify-content-between gap-2 flex-column flex-md-row mt-3">
                            {/* Botón de Editar */}
                            <button type="submit" className="btn btn-primary flex-grow-1">Editar</button>
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

export default EditarUsuarioPage;
