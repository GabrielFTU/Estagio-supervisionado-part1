import api from './api';

const endpoint = '/FichasTecnicas';

const fichaTecnicaService = {
  getAll: async () => {
    const response = await api.get(endpoint);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  },
  getProximoCodigo: async () => {
    const response = await api.get('/fichastecnicas/proximo-codigo');
    return response.data;
},

  create: async (data) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  }
  
 
};

export default fichaTecnicaService;