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

// Nuevas funciones para el módulo Jugar - Esperan un token

export const iniciarPartida = (idMazo, token) => {
    // Es crucial que el token se incluya en el header de autorización
    return api.post('/partidas', { mazo_id: idMazo }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const realizarJugada = (idPartida, idCartaJugada, token) => {
    return api.post('/jugadas', {
        id_partida: Number(idPartida),
        carta_jugada: idCartaJugada, 
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const getCartasEnMano = (usuario, partidaId, token) => {
    return api.get(`/usuarios/${usuario}/partidas/${partidaId}/cartas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};


export const obtenerCartasEnManoUsuario = (idUsuario, partidaId, token) => {
  return api.get(`/usuarios/${idUsuario}/partidas/${partidaId}/cartas`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// NUEVO ENDPOINT PARA DEVOLVER CARTAS DEL SERVIDOR
export const obtenerCartasEnManoServidor = (partidaId, token) => {
  return api.get(`/partidas/${partidaId}/cartas/servidor`, { 
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
