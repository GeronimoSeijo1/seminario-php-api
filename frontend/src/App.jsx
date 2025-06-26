import { Routes, Route } from 'react-router-dom';
import StatPage from './pages/stat/statPage';
import AddMazoPage from './pages/mazo/addMazoPage';
// (más adelante se agregara RegistroPage, LoginPage, etc.)

function App() {
  return (
    <Routes>
      <Route path="/" element={<StatPage />} />
      <Route path="/addMazoPage" element={<AddMazoPage />} />
      {/* Ejemplo de futuras rutas */}
      {/* <Route path="/registro" element={<RegistroPage />} /> */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  );
}

export default App;

