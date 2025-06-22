import { api } from '../api/api';

export const getStats = () => api.get('/estadisticas');

export const registerUser = (datos) => api.post('/registro', datos);

export const loginUser = (datos) => api.post('/login', datos);

export const editUser = (id, datos, token) => {
  return api.put(`/usuarios/${id}`, datos, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
