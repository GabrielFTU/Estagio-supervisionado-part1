import api from './api';

const CategoriasProdutoService = {
  getAll: async () => {
    const response = await api.get('/CategoriasProduto');
    return response.data;
  },
};

export default CategoriasProdutoService;