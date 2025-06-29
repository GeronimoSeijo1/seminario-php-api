import {Routes, Route } from 'react-router-dom';
import StatPage from './pages/stat/statPage';
import RegistroPage from './pages/registro/RegistroPage';
import LoginPage from './pages/login/LoginPage';
import EditarUsuarioPage from './pages/editar/EditarUsuarioPage.jsx';
import JugarPage from './pages/Jugar/JugarPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StatPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/editar" element={<EditarUsuarioPage />} />
       <Route path="/jugar/:idPartida" element={<JugarPage />} />
    </Routes>
  );
}


export default App;

