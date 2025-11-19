import api from './api';

const endpoint = '/OrdensDeProducao';

const ordemDeProducaoService = {
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
  },
  getReportUrl: (id) => {
    return `${api.defaults.baseURL.replace('/api', '')}/api/Relatorios/ordem-producao/${id}/visualizar`;
  }
};

export default ordemDeProducaoService;