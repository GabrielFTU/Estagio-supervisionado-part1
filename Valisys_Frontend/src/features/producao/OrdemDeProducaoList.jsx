import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Edit, Trash2, PlayCircle, CheckCircle } from 'lucide-react'; 
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
      const errorMessage = err.response?.data?.message || "Erro ao excluir.";
      alert(errorMessage);
    }
  });

  const avancarFaseMutation = useMutation({
    mutationFn: ordemDeProducaoService.avancarFase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Não foi possível avançar a fase.";
      alert(msg);
    }
  });

  const finalizarMutation = useMutation({
    mutationFn: ordemDeProducaoService.finalizar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      alert("Ordem finalizada com sucesso! Produto enviado ao estoque.");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Erro ao finalizar a ordem.";
      alert(msg);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta Ordem de Produção?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleAvanacarFase = (id) => {
      if(window.confirm("Confirmar avanço para a próxima fase do roteiro?")) {
          avancarFaseMutation.mutate(id);
      }
  };

  const handleFinalizar = (id) => {
      if(window.confirm("Confirma a conclusão da produção? O produto entrará no estoque.")) {
          finalizarMutation.mutate(id);
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
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

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
                <td style={{fontWeight: 'bold'}}>{op.quantidade}</td>
                <td>
                    {op.faseAtualNome}
                    {op.roteiroCodigo && <span style={{fontSize: '0.7rem', color: '#666', display: 'block'}}>Rot: {op.roteiroCodigo}</span>}
                </td>
                <td>
                  <span className={getStatusClass(op.status)}>
                    {op.status}
                  </span>
                </td>
                <td>{new Date(op.dataInicio).toLocaleDateString()}</td>
                <td className="acoes-cell">
                  
                  <button 
                    className="icon-action"
                    title="Avançar Próxima Fase"
                    onClick={() => handleAvanacarFase(op.id)}
                    style={{color: '#16a34a'}}
                    disabled={op.status === 'Finalizada' || avancarFaseMutation.isPending}
                  >
                    <PlayCircle size={20} />
                  </button>

                  <button 
                    className="icon-action"
                    title="Finalizar Produção (Gerar Estoque)"
                    onClick={() => handleFinalizar(op.id)}
                    style={{color: '#2563eb'}}
                    disabled={op.status === 'Finalizada' || finalizarMutation.isPending}
                  >
                    <CheckCircle size={20} />
                  </button>

                  <button 
                    className="icon-action"
                    title="Visualizar Relatório"
                    onClick={() => handleViewReport(op.id)}
                  >
                    <FileText size={18} />
                  </button>
                  
                  <button 
                    className="btn-icon btn-edit" 
                    onClick={() => navigate(`${basePath}/editar/${op.id}`)}
                    disabled={op.status === 'Finalizada'}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-delete" 
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
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
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