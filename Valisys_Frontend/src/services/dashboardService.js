import api from './api';

const dashboardService = {
  getStats: async () => {
    const response = await api.get('/Dashboard');
    return response.data;
  }
};

export default dashboardService;