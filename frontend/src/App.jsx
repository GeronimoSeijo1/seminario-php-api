import {Routes, Route } from 'react-router-dom';
import StatPage from './pages/stat/statPage';
import RegistroPage from './pages/registro/RegistroPage';
import LoginPage from './pages/login/LoginPage';
import EditarUsuarioPage from './pages/editar/EditarUsuarioPage.jsx';
import MisMazosPage from './pages/mazos/MisMazosPage';


// (más adelante se agregara RegistroPage, LoginPage, etc.)

function App() {
  return (
    <Routes>
      <Route path="/" element={<StatPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/editar" element={<EditarUsuarioPage />} />
      <Route path="/mis-mazos" element={<MisMazosPage />} />
    </Routes>
  );
}


export default App;

