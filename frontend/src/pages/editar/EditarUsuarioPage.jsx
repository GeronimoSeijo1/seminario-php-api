import { useState, useEffect } from "react";
import { editUser } from '../../services/apiServices.js';
import Layout from '../../layout/Layout.jsx';
import '../../assets/styles/Forms.css';

function EditarUsuarioPage() {
    const [errores, setErrores] = useState([]);


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
            alert("Perfil actualizado con éxito");
            setErrores([]);
        } catch (error) {
            if (error.response?.data?.error) {
                setErrores([error.response.data.error]);
            } else {
                setErrores(["Error al actualizar el usuario."]);
            }
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="left">
                    {errores.length > 0 && (
                        <div className="errores">
                            <ul>
                                {errores.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <h2 className="title"> EDITAR USUARIO </h2>
                    <form className='form' onSubmit={handleSubmit}>
                        <label>Ingresa tu nombre</label>
                        <input type='text' name="nombre"/>

                        <label>Ingresa contraseña</label>
                        <input type='password' name="password"/>

                        <label>Repetir contraseña</label>
                        <input type='password' name="passwordRep"/>

                        <button type="submit">Editar</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default EditarUsuarioPage;
