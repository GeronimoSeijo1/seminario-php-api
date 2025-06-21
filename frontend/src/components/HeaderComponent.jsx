import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/Pokeball.svg'; 
import NavBarComponent from './NavBarComponent';
import '../assets/styles/HeaderComponent.css';

function HeaderComponent() {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="container d-flex justify-content-between align-items-center py-2">
        <div
          className="d-flex align-items-center header-logo-area" /* Usamos header-logo-area para agrupar */
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img
            src={logo} /* Usar el Pokeball.svg */
            alt="Pokebattle logo"
            className="pokebattle-logo-img"
          />
          <span className="pokebattle-text">PokeBattle</span> {/* Texto al lado del logo */}
        </div>
        <NavBarComponent />
      </div>
    </header>
  );
}

export default HeaderComponent;