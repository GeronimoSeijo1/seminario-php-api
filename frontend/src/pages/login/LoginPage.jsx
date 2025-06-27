import { useState } from "react";
import { loginUser } from '../../services/apiServices.js';
import { useNavigate } from "react-router-dom";
import Layout from '../../layout/Layout.jsx';
import '../../assets/styles/Forms.css';

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
            
            alert("Usuario logueado");
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

                    <h2 className="title"> LOGIN </h2>
                    <form className='form' onSubmit={handleSubmit}>

                        <label>Ingresa nombre de usuario</label>
                        <input type='text' name="usuario"/>

                        <label>Ingresa contraseña</label>
                        <input type='password' name="password"/>

                        <button type="submit">Loguearme</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default LoginPage;