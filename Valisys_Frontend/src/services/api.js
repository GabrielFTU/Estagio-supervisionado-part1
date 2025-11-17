import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';

const api = axios.create({
  baseURL: 'http://localhost:5019/api' 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('valisys_token'); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;