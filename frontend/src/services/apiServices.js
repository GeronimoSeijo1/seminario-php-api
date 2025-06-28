import { api } from '../api/api';

export const getStats = () => api.get('/estadisticas');
export const getMazos = (id,token) => api.get(`/usuarios/${id}/mazos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
});

export const registerUser = (datos) => api.post('/registro', datos);

export const loginUser = (datos) => api.post('/login', datos);

export const editUser = (id, datos, token) => {
  return api.put(`/usuarios/${id}`, datos, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const getCartas = (filtros = {}) => api.get('/cartas', { params: filtros });
export const addMazo = (datos,token) => api.post('/mazos',datos, {
    headers: {
      Authorization: `Bearer ${token}`
    }
});
