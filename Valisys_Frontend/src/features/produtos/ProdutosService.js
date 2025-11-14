import api from './api';

const ProdutosService = {
  getAll: async () => {
    const response = await api.get('/Produtos');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/Produtos/${id}`);
    return response.data;
  },
  
  create: async (produtoData) => {
    const response = await api.post('/Produtos', produtoData);
    return response.data;
  },
  
  update: async (id, produtoData) => {
    const response = await api.put(`/Produtos/${id}`, produtoData);
    return response.data;
  },
  
  remove: async (id) => {
    const response = await api.delete(`/Produtos/${id}`);
    return response.data;
  },
};

export default ProdutosService;