// src/pages/stat/StatPage.jsx
import { useEffect, useState } from 'react';
import { getStats } from '../../services/apiServices.js';
import Layout from '../../layout/Layout.jsx';
import '../../assets/styles/StatPage.css';

function StatPage() {
  const [stats, setStats] = useState([]);
  const [ordenAscendente, setOrdenAscendente] = useState(false); // false = descendente (mejor a peor winrate)
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  useEffect(() => {
    getStats()
      .then(res => setStats(res.data))
      .catch(err => console.error('Error cargando estadísticas:', err));
  }, []);

  const statsOrdenadas = [...stats].sort((a, b) => {
    let comparison = 0; // Por defecto, se consideran iguales

    // 1. Primer criterio: Winrate (Mayor a menor)
    if (a.winrate !== b.winrate) {
      comparison = b.winrate - a.winrate; // Mayor winrate primero
    } else if (a.total_partidas !== b.total_partidas) {
      // 2. Segundo criterio: Partidas Jugadas (Mayor a menor)
      comparison = b.total_partidas - a.total_partidas; // Más PJ primero
    } else if (a.partidas_ganadas !== b.partidas_ganadas) {
      // 3. Tercer criterio: Partidas Ganadas (Mayor a menor)
      comparison = b.partidas_ganadas - a.partidas_ganadas; // Más G primero
    } else if (a.partidas_empatadas !== b.partidas_empatadas) {
      // 4. Cuarto criterio: Partidas Empatadas (Mayor a menor)
      comparison = b.partidas_empatadas - a.partidas_empatadas; // Más E primero
    } else {
      // 5. Quinto criterio: Partidas Perdidas (Menor a mayor)
      // Si todo lo anterior es igual, el que tenga MENOS partidas perdidas es mejor.
      comparison = a.partidas_perdidas - b.partidas_perdidas; // Menos P primero
    }

    // Aplicar la dirección de ordenación final:
    // Si ordenAscendente es true, invierte el resultado (para ir de menor a mayor).
    // Si ordenAscendente es false (descendente), usa el resultado tal cual (para ir de mayor a menor).
    return ordenAscendente ? -comparison : comparison;
  });

  const totalPaginas = Math.ceil(statsOrdenadas.length / itemsPorPagina);
  const statsPaginadas = statsOrdenadas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  // El "winrateMasAltoGeneral" se calcula solo una vez y es el winrate más alto de todos los jugadores.
  const winrateMasAltoGeneral = stats.length > 0
    ? Math.max(...stats.map(s => s.winrate))
    : 0;

  return (
    <Layout>
        <div className="container d-flex justify-content-center">
          <div className="leaderboard-card w-100" style={{ maxWidth: '900px' }}>
            <div className="leaderboard-header">ESTADISTICAS</div>

            <div className="leaderboard-row header static-header">
              <div>#</div>
              <div>Usuario</div>
              <div>PJ</div>   
              <div>G</div>
              <div>E</div>
              <div>P</div>
              <div
                className="sortable-header"  
                onClick={() => {
                  setOrdenAscendente(!ordenAscendente);
                  setPaginaActual(1); // Resetear a la primera página al cambiar el orden
                }}
                style={{ cursor: 'pointer' }}
              >
                Winrate <i className={`bi ${ordenAscendente ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`}></i>
              </div>
            </div>

            {statsPaginadas.map((j, index) => ( // Volvemos a usar 'index' aquí para la posición DENTRO de la página
              <div
                key={j.usuario} // Asegúrate de que 'j.usuario' sea siempre único, o usa un ID de la API
                className={`leaderboard-row animated-row ${j.winrate === winrateMasAltoGeneral && !ordenAscendente ? 'best' : ''}`}
                // La clase 'best' solo se aplica si es el winrate más alto Y el orden es descendente
              >
                {/* Cálculo de posición corregido */}
                <div>{(paginaActual - 1) * itemsPorPagina + index + 1}</div> 
                <div>{j.usuario}</div>
                <div>{j.total_partidas}</div>
                <div>{j.partidas_ganadas}</div>
                <div>{j.partidas_empatadas}</div>
                <div>{j.partidas_perdidas}</div>
                <div>{j.winrate}%</div>
              </div>
            ))}

            {/* ... (El código de las filas vacías y paginación se mantiene igual) ... */}
            {Array.from({ length: itemsPorPagina - statsPaginadas.length }).map((_, i) => (
              <div className="leaderboard-row" key={`empty-${i}`}>
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div>
              </div>
            ))}

            <nav className="d-flex justify-content-center pagination">
              <ul className="pagination">
                {Array.from({ length: totalPaginas }).map((_, i) => (
                  <li key={i} className={`page-item ${i + 1 === paginaActual ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
    </Layout>
  );
}

export default StatPage;