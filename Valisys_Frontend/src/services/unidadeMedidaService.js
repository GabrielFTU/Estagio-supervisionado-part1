import api from './api.js';

const endpoint = '/UnidadesMedida';

const unidadeMedidaService = {
  getAll: async () => {
    const response = await api.get(endpoint);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  update: async (id, data) => {
    const dataToSend = { ...data, Id: id };
    const response = await api.put(`${endpoint}/${id}`, dataToSend);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  }
};

export default unidadeMedidaService;