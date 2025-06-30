// src/components/NavBarComponent.jsx
import { Link, NavLink } from 'react-router-dom'; // Asegúrate de importar NavLink
import '../assets/styles/NavBarComponent.css'; 

function NavBarComponent() {
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('usuario');

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; // Redirige a la página de inicio
  };

  return (
    <nav className="main-nav"> 
      <ul className="nav-list"> 
        {token && (
          <>
            <li className="nav-item user-greeting"> {/* Clase para el saludo */}
              <span className="pokemon-link">Hola, {nombre}</span>
            </li>
          </>
        )}
        {/* ENLACE PARA ESTADISTICAS / RUTA PRINCIPAL */}
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) => `pokemon-link ${isActive ? 'active' : ''}`}
            end // Importante: 'end' asegura que solo se active si la ruta es EXACTAMENTE '/'
          >
            INICIO
          </NavLink>
        </li>

        {!token ? (
          <>
            <li className="nav-item">
              <NavLink to="/registro" className={({ isActive }) => `pokemon-link ${isActive ? 'active' : ''}`}>CREAR CUENTA</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login" className={({ isActive }) => `btn access-button ${isActive ? 'active' : ''}`}> ACCEDER </NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <NavLink to="/mis-mazos" className={({ isActive }) => `pokemon-link ${isActive ? 'active' : ''}`}>MIS MAZOS</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/editar" className={({ isActive }) => `pokemon-link ${isActive ? 'active' : ''}`}>EDITAR USUARIO</NavLink>
            </li>
            <li className="nav-item">
              <button
                className="logout-button" // Clase personalizada para el botón de logout
                onClick={handleLogout} // Usamos la función handleLogout
                title="Cerrar sesión" // Añadimos un título para accesibilidad
              >
                {/* Icono de Bootstrap */}
                <i className="bi bi-box-arrow-right"></i> 
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBarComponent;
