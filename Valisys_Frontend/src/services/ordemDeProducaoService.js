import api from './api';

const endpoint = '/OrdensDeProducao';

const ordemDeProducaoService = {
  // Lista todas as OPs
  getAll: async () => {
    const response = await api.get(endpoint);
    return response.data;
  },

  // Busca OP por ID (GUID)
  getById: async (id) => {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  },

  // NOVO: Busca OP pelo Código (ex: OP-001) - Usado na tela de Consulta
  getByCodigo: async (codigo) => {
    const response = await api.get(`${endpoint}/codigo/${codigo}`);
    return response.data;
  },

  // Cria nova OP
  create: async (data) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  // Atualiza OP existente
  update: async (id, data) => {
    const dataToSend = { ...data, Id: id };
    const response = await api.put(`${endpoint}/${id}`, dataToSend);
    return response.data;
  },

  // Exclui OP
  delete: async (id) => {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  },

  // NOVO: Avança para a próxima fase sequencial (Botão Play / Consulta OP)
  avancarFase: async (id) => {
    const response = await api.post(`${endpoint}/${id}/proxima-fase`);
    return response.data;
  },

  // NOVO: Move para uma fase específica (Arrastar e soltar do Kanban)
  trocarFase: async (id, faseId) => {
    const response = await api.patch(`${endpoint}/${id}/fase/${faseId}`);
    return response.data;
  },

  // NOVO: Finaliza a ordem e gera entrada no estoque (Botão Check / Consulta OP)
  finalizar: async (id) => {
    const response = await api.post(`${endpoint}/${id}/finalizar`);
    return response.data;
  },

  // Gera link do relatório PDF
  getReportUrl: (id) => {
    // Remove o '/api' final da baseURL se existir, para montar a URL correta do relatório
    const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '');
    return `${baseUrl}/api/Relatorios/ordem-producao/${id}/visualizar`;
  }
};

export default ordemDeProducaoService;