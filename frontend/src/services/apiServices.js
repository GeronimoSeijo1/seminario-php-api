import { api } from '../api/api';

export const getStats = () => api.get('/estadisticas');
