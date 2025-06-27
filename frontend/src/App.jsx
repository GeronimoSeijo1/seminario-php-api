import { Routes, Route } from 'react-router-dom';
import StatPage from './pages/stat/statPage';
import JugarPage from './pages/play/JugarPage';
// (más adelante se agregara RegistroPage, LoginPage, etc.)

function App() {
  return (
    <Routes>
      <Route path="/" element={<StatPage />} />
      <Route path="/jugar" element={<JugarPage />} />
      {/* Ejemplo de futuras rutas */}
      {/* <Route path="/registro" element={<RegistroPage />} /> */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  );
}

export default App;

