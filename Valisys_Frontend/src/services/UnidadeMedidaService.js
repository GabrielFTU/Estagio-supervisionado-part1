import api from './api';

const UnidadeMedidaService = {
  getAll: async () => {
    const response = await api.get('/UnidadesMedida');
    return response.data;
  },
};

export default UnidadeMedidaService;