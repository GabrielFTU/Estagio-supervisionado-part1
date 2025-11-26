import api from './api.js';

const endpoint = '/Usuarios';

const usuarioService = {
  getAll: async () => {
    const response = await api.get(endpoint);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  },

  create: async (usuarioData) => {
    const response = await api.post(endpoint, usuarioData);
    return response.data;
  },

  update: async (id, usuarioData) => {
    const dataToSend = { ...usuarioData, id }; 
    const response = await api.put(`${endpoint}/${id}`, dataToSend);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  }
};

export default usuarioService;