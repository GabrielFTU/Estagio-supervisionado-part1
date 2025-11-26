import api from './api.js';

const authService = {
  login: async (email, senha) => {
    
    const loginData = {
      Email: email,
      Senha: senha
    };

    const response = await api.post('/Auth/login', loginData);
    
    return response.data; 
  }
};

export default authService;