import api from "./api";

const produtoService = {
  getAll: async () => {
    const response = await api.get('/Produtos');
    return response.data;
  },
};

export default produtoService;
