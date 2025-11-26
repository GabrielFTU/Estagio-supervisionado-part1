import api from './api';

const endpoint = '/Perfis';

const perfilService = {
    getAll: async () => {
        const response = await api.get(endpoint);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data;
    },

    create: async (perfilData) => {
        const response = await api.post(endpoint, perfilData);
        return response.data;
    },

    update: async (id, perfilData) => {
        const data = { ...perfilData, id };
        const response = await api.put(`${endpoint}/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`${endpoint}/${id}`);
        return response.data;
    }
};

export default perfilService;
    