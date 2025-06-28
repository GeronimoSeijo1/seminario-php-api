import {Routes, Route } from 'react-router-dom';
import StatPage from './pages/stat/statPage';
import AddMazoPage from './pages/mazo/addMazoPage';
import RegistroPage from './pages/registro/RegistroPage';
import LoginPage from './pages/login/LoginPage';
import EditarUsuarioPage from './pages/editar/EditarUsuarioPage.jsx';

// (más adelante se agregara RegistroPage, LoginPage, etc.)

function App() {
  return (
    <Routes>
      <Route path="/" element={<StatPage />} />
      <Route path="/addMazo" element={<AddMazoPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/editar" element={<EditarUsuarioPage />} />
    </Routes>
  );
}


export default App;

