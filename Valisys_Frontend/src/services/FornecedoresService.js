import axios from "axios";

const API_URL = 'http://localhost:5019/api/Fornecedores';

const FornecedoresService = {
    getAll: async () => {
       const response = await axios.get(API_URL);
       return response.data; 
    },
    getById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data
    },
    create: async (fornecedor) => {
        const response = await axios.post(API_URL, fornecedor)
        return response.data;
    },
    update: async (id, fornecedor) => {
        const response = await axios.put(`${API_URL}/${id}`, fornecedor);
        return response.data;
    },
    remove: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },  
};

export default FornecedoresService;