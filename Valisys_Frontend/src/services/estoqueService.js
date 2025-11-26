import api from './api';

const estoqueService = {
  getSimples: async () => {
    const response = await api.get('/Estoque/simples');
    return response.data;
  },
  getAnalitico: async () => {
    const response = await api.get('/Estoque/analitico');
    return response.data;
  }
};

export default estoqueService;