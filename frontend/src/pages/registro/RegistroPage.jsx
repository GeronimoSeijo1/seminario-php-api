import { useState } from "react";
import { registerUser } from '../../services/apiServices.js';
import { useNavigate } from "react-router-dom";
import Layout from '../../layout/Layout.jsx';
import '../../assets/styles/Forms.css';

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
            alert("Usuario registrado con éxito");
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

                    <h2 className="title"> REGISTRAR USUARIO </h2>
                    <form className='form' onSubmit={handleSubmit}>
                        <label>Ingresa tu nombre</label>
                        <input type='text' name="nombre"/>

                        <label>Ingresa nombre de usuario</label>
                        <input type='text' name="usuario"/>

                        <label>Ingresa contraseña</label>
                        <input type='password' name="password"/>

                        <button type="submit">Registrarme</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default RegistroPage;
