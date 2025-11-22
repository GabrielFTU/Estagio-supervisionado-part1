import api from './api';

const endpoint = '/LogsSistema';

const logService = {
  getAll: async () => {
    const response = await api.get(endpoint);
    return response.data;
  }
};

export default logService;