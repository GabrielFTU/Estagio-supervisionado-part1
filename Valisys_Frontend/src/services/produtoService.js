import api from "./api";

const produtoService = {
  getAll: async () => {
    const response = await api.get('/Produtos');
    return response.data;
  },
  getById: async (id) => {
    const reponse = await api.get(`/Produtos/${id}`);
    return reponse.data;
  },
  create: async (produtoData) => {
    const response = await api.post('/Produtos', produtoData);
    return response.data;
  },
  update: async (id, produtoData) => {
    const data = { ...produtoData, id };
    const response = await api.put(`/Produtos/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/Produtos/${id}`);
    return response.data;
  }
};



export default produtoService;
