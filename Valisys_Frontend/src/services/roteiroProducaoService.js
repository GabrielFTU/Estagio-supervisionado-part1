import api from './api';
const endpoint = '/RoteirosProducao';

const roteiroProducaoService = {
  getAll: async () => (await api.get(endpoint)).data,
  getById: async (id) => (await api.get(`${endpoint}/${id}`)).data,
  create: async (data) => (await api.post(endpoint, data)).data,
  update: async (id, data) => (await api.put(`${endpoint}/${id}`, { ...data, id })).data,
  delete: async (id) => (await api.delete(`${endpoint}/${id}`)).data
};

export default roteiroProducaoService;