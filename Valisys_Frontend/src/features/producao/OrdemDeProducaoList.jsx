import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Edit, Trash2 } from 'lucide-react';
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import '../../features/produto/ProdutoList.css'; 

function useOrdensDeProducao() {
  return useQuery({
    queryKey: ['ordensDeProducao'],
    queryFn: ordemDeProducaoService.getAll
  });
}

function OrdemDeProducaoList() {
  const { data: ordens, isLoading, isError, error } = useOrdensDeProducao();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: ordemDeProducaoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      alert("Ordem de Produção excluída com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao excluir. Verifique se a OP não está finalizada.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta Ordem de Produção?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleViewReport = (id) => {
    const reportUrl = ordemDeProducaoService.getReportUrl(id);
    window.open(reportUrl, '_blank');
  };

  const getStatusClass = (status) => {
      if (status === 'Ativa') return 'status-ativo';
      if (status === 'Finalizada') return 'status-inativo';
      return 'status-pendente';
  };
  
  const basePath = '/producao/op';

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar Ordens de Produção: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Ordens de Produção</h1>
        <Link to={`${basePath}/novo`} className="btn-new">+ Nova Ordem</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Almoxarifado</th>
            <th>Fase Atual</th>
            <th>Status</th>
            <th>Início</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {ordens && ordens.length > 0 ? (
            ordens.map((op) => (
              <tr key={op.id}>
                <td>{op.codigoOrdem}</td>
                <td>{op.produtoNome}</td>
                <td>{op.quantidade}</td>
                <td>{op.almoxarifadoNome}</td>
                <td>{op.faseAtualNome}</td>
                <td>
                  <span className={getStatusClass(op.status)}>
                    {op.status}
                  </span>
                </td>
                <td>{new Date(op.dataInicio).toLocaleDateString()}</td>
                <td className="acoes-cell">
                  
                  <button 
                    className="icon-action"
                    title="Visualizar Relatório"
                    onClick={() => handleViewReport(op.id)}
                  >
                    <FileText size={18} />
                  </button>
                  
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`${basePath}/editar/${op.id}`)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(op.id)}
                    disabled={deleteMutation.isPending || op.status === 'Finalizada'}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                Nenhuma Ordem de Produção encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrdemDeProducaoList;