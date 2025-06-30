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

// Nuevas funciones para el módulo Jugar

export const iniciarPartida = (idMazo, token) => {
  return api.post('/partidas', { mazo_id: idMazo }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const realizarJugada = (idPartida, idCartaJugada, token) => {
  return api.post('/jugadas', {
    id_partida: idPartida,
    carta_jugada: idCartaJugada
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getCartasEnMano = (usuario, partidaId, token) => {
  return api.get(`/usuarios/${usuario}/partidas/${partidaId}/cartas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const obtenerCartasEnManoUsuario = (idUsuario, partidaId, token) => {
  return api.get(`/usuarios/${idUsuario}/partidas/${partidaId}/cartas`, {
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

// Función para obtener las cartas en mano del servidor para una partida
export const obtenerCartasEnManoServidor = (servidorId, partidaId, token) => {
  return api.get(`/usuarios/${servidorId}/partidas/${partidaId}/cartas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

