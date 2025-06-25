import { Routes, Route } from 'react-router-dom';
import StatPage from './pages/stat/statPage';
// (más adelante se agregara RegistroPage, LoginPage, etc.)

function App() {
  return (
    <Routes>
      <Route path="/" element={<StatPage />} />
      {/* Ejemplo de futuras rutas */}
      {/* <Route path="/registro" element={<RegistroPage />} /> */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  );
}

export default App;

