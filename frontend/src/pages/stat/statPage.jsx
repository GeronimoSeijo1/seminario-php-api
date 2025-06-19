import { useEffect, useState } from 'react';
import { getStats } from '../../services/apiServices.js';
import Layout from '../../layout/Layout.jsx';
import '../../assets/styles/StatPage.css';


function StatPage() {
  const [stats, setStats] = useState([]);
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  useEffect(() => {
    getStats()
      .then(res => setStats(res.data))
      .catch(err => console.error('Error cargando estadísticas:', err));
  }, []);

  // Ordenar por winrate
  const statsOrdenadas = [...stats].sort((a, b) => {
    return ordenAscendente
      ? a.winrate - b.winrate
      : b.winrate - a.winrate;
  });

  // Paginado
  const totalPaginas = Math.ceil(statsOrdenadas.length / itemsPorPagina);
  const statsPaginadas = statsOrdenadas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const mejorWinrate = statsOrdenadas[0]?.winrate ?? 0;

  return (
    <Layout>
        <div className="container">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Estadísticas de Jugadores</h2>
                    <div className="table-responsive">
                        <table className="table table-bordered text-center align-middle" style={{ tableLayout: 'fixed' }}>
                            <thead className="table-light">
                            <tr>
                                <th style={{ width: '14%' }}>Usuario</th>
                                <th style={{ width: '14%' }}>Ganadas</th>
                                <th style={{ width: '14%' }}>Perdidas</th>
                                <th style={{ width: '14%' }}>Empatadas</th>
                                <th style={{ width: '14%' }}>Total</th>
                                <th style={{ width: '16%' }}>
                                <button
                                    className="btn btn-sm btn-outline-primary w-100"
                                    onClick={() => setOrdenAscendente(!ordenAscendente)}
                                >
                                    Winrate {ordenAscendente ? '↓' : '↑'}
                                </button>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                                {statsPaginadas.map((j, index) => (
                                    <tr className={`fixed-row-height ${j.winrate === mejorWinrate ? 'table-success fw-semibold' : ''}`}>
                                    <td>
                                        {j.usuario}
                                        {j.winrate === mejorWinrate && (
                                        <i className="bi bi-award-fill text-warning ms-2" title="Mejor jugador"></i>
                                        )}
                                    </td>
                                    <td>{j.partidas_ganadas}</td>
                                    <td>{j.partidas_perdidas}</td>
                                    <td>{j.partidas_empatadas}</td>
                                    <td>{j.total_partidas}</td>
                                    <td>{j.winrate}%</td>
                                    </tr>
                                ))}

                                {/* Rellenar hasta completar 5 filas */}
                                {Array.from({ length: itemsPorPagina - statsPaginadas.length }).map((_, i) => (
                                <tr className="fixed-row-height" key={`empty-${i}`}>
                                    <td colSpan={6}></td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Paginado */}
            <nav className="d-flex justify-content-center mt-3">
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
    </Layout>

  );
}

export default StatPage;
