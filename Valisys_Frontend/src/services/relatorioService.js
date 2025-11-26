import api from './api';

const endpoint = '/Relatorios';

const relatorioService = {
  getLinkVisualizarOrdem: (id) => {
    const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, ''); 
    return `${baseUrl}/api${endpoint}/ordem-producao/${id}/visualizar`;
  },

  downloadMovimentacoes: async (dataInicio, dataFim, produtoId, almoxarifadoId) => {
    const response = await api.get(`${endpoint}/movimentacoes`, {
      params: { dataInicio, dataFim, produtoId: produtoId || null, almoxarifadoId: almoxarifadoId || null },
      responseType: 'blob'
    });
    return response.data;
  },

  downloadProdutos: async (apenasAtivos, categoriaId) => {
    const response = await api.get(`${endpoint}/produtos`, {
      params: { apenasAtivos, categoriaId: categoriaId || null },
      responseType: 'blob'
    });
    return response.data;
  },


  downloadProducao: async (dataInicio, dataFim, status) => {
    const response = await api.get(`${endpoint}/producao`, {
      params: { 
        dataInicio: dataInicio || null, 
        dataFim: dataFim || null,
        status: status || null 
      },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default relatorioService;