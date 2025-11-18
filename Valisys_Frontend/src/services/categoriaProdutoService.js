import api from './api.js';

const categoriaProdutoService = {
  getAll: async () => {
    const response = await api.get('/CategoriasProduto');
    return response.data;
  },
};

export default categoriaProdutoService;