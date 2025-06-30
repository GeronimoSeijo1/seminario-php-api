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

export const getUserMazos = (userId, token) => {
  return api.get(`/usuarios/${userId}/mazos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getCartasDeMazo = (userId, mazoId, token) => {
  return api.get(`/usuarios/${userId}/mazos/${mazoId}/cartas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const editarNombreMazo = (mazoId, nuevoNombre, token) => {
  return api.put(`/mazos/${mazoId}`, { nombre: nuevoNombre }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const eliminarMazo = (mazoId, token) => {
  return api.delete(`/mazos/${mazoId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
