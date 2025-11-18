import api from './api.js';

const unidadeMedidaService = {
  getAll: async () => {
    const response = await api.get('/UnidadesMedida');
    return response.data;
  },
};

export default unidadeMedidaService;