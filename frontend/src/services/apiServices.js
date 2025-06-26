import { api } from '../api/api';

export const getStats = () => api.get('/estadisticas');
export const getMazos = (id) => api.get('/usuarios/${id:[0-9]+}/mazos', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
export const getCartas = (filtros = {}) => api.get('/cartas', { params: filtros });
export const addMazo = (datos) => api.post('/mazos',datos, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });