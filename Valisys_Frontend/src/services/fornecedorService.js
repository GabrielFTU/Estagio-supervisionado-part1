import api from './api';

const endpoint = '/Fornecedores';

const fornecedorService = {
  getAll: async () => {
    const response = await api.get(endpoint);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  },

  create: async (fornecedorData) => {
    const response = await api.post(endpoint, fornecedorData);
    return response.data;
  },

  update: async (id, fornecedorData) => {
    const dataToSend = { ...fornecedorData, Id: id }; 
    const response = await api.put(`${endpoint}/${id}`, dataToSend);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  }
};

export default fornecedorService;