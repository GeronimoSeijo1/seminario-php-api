import { Link } from 'react-router-dom';

function NavBarComponent() {
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('nombre');

  return (
    <nav>
      <ul className="nav">
        {!token ? (
          <>
            <li className="nav-item">
              <Link to="/registro" className="nav-link text-primary">Registro</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link text-primary">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <span className="nav-link text-primary">Hola, {nombre}</span>
            </li>
            <li className="nav-item">
              <Link to="/mis-mazos" className="nav-link text-primary">Mis Mazos</Link>
            </li>
            <li className="nav-item">
              <Link to="/editar" className="nav-link text-primary">Editar</Link>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBarComponent;

