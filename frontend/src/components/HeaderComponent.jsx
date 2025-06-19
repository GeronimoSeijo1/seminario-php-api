import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/pokemon.png';
import NavBarComponent from './NavBarComponent';

function HeaderComponent() {
  const navigate = useNavigate();

  return (
    <header className="bg-light border-bottom shadow-sm">
      <div className="container d-flex justify-content-between align-items-center py-2">
        <div
          className="d-flex align-items-center"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img
            src={logo}
            alt="Pokebattle logo"
            style={{ height: '50px', marginRight: '10px' }}
          />
        </div>
        <NavBarComponent />
      </div>
    </header>
  );
}

export default HeaderComponent;
