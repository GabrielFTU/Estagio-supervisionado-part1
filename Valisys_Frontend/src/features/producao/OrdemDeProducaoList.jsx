import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Edit, Trash2, PlayCircle, CheckCircle, XCircle, Search, X, Filter } from 'lucide-react'; 
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import '../../features/produto/ProdutoList.css'; 

const STATUS_MAP = {
    1: { label: 'Ativa', class: 'status-ativo' },
    2: { label: 'Aguardando', class: 'status-aguardando' },
    3: { label: 'Finalizada', class: 'status-concluida' },
    4: { label: 'Cancelada', class: 'status-cancelada' }
};
function useOrdensDeProducao() {
  return useQuery({
    queryKey: ['ordensDeProducao'],
    queryFn: ordemDeProducaoService.getAll,
    staleTime: 0, 
    refetchOnWindowFocus: true
  });
}

function OrdemDeProducaoList() {
  const { data: ordens, isLoading, isError, error } = useOrdensDeProducao();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const invalidateList = () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
  };

  const deleteMutation = useMutation({
    mutationFn: ordemDeProducaoService.delete, 
    onSuccess: () => {
      invalidateList();
      alert("Ordem de Produção excluída com sucesso!");
    },
    onError: (err) => alert(err.response?.data?.message || "Erro ao excluir.")
  });

  const avancarFaseMutation = useMutation({
    mutationFn: ordemDeProducaoService.avancarFase,
    onSuccess: () => {
      invalidateList(); 
    },
    onError: (err) => alert(err.response?.data?.message || "Erro ao avançar fase.")
  });

  const finalizarMutation = useMutation({
    mutationFn: ordemDeProducaoService.finalizar,
    onSuccess: () => {
      invalidateList();
      alert("Produção finalizada! Estoque gerado.");
    },
    onError: (err) => alert(err.response?.data?.message || "Erro ao finalizar.")
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta Ordem de Produção?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleAvancarFase = (id) => {
      if(window.confirm("Confirmar avanço de fase/conclusão?")) {
          avancarFaseMutation.mutate(id);
      }
  };

  const handleFinalizarManual = (id) => {
      if(window.confirm("Deseja forçar a finalização desta ordem e enviar ao estoque?")) {
          finalizarMutation.mutate(id);
      }
  }
  
  const handleViewReport = (id) => {
    const reportUrl = ordemDeProducaoService.getReportUrl(id);
    window.open(reportUrl, '_blank');
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

      <div className="toolbar-container">
        <div className="search-box">
            <Search size={20} className="search-icon" />
            <input 
                type="text" 
                placeholder="Buscar por código ou produto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <button className="btn-clear-search" onClick={() => setSearchTerm('')}>
                    <X size={16} />
                </button>
            )}
        </div>

        <div className="filter-box">
            <Filter size={20} className="filter-icon" />
            <select 
                className="select-standard"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">Todos os Status</option>
                <option value="ativo">Apenas Ativos</option>
                <option value="inativos">Apenas Inativos</option>
            </select>
        </div>
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
            (ordens || []).filter(op => {
              const q = (searchTerm || '').toLowerCase();
              const matchesSearch = !q || String(op.codigoOrdem).toLowerCase().includes(q) || String(op.produtoNome || '').toLowerCase().includes(q);
              const statusId = Number(op.status);
              const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'ativo' ? statusId === 1 : statusId !== 1);
              return matchesSearch && matchesStatus;
            }).map((op) => {
              const statusId = Number(op.status); 
              const statusConfig = STATUS_MAP[statusId] || { label: 'Desconhecido', class: '' };
              
              const isFinalizada = statusId === 3;
              const isCancelada = statusId === 4;
              const isInactive = isFinalizada || isCancelada;

              return (
              <tr key={op.id} style={isInactive ? {backgroundColor: '#f9fafb', opacity: 0.9} : {}}>
                <td style={{fontWeight: 'bold', color: '#374151'}}>{op.codigoOrdem}</td>
                <td>{op.produtoNome}</td>
                <td style={{fontWeight: 'bold'}}>{op.quantidade}</td>
                
                <td>
                    {isFinalizada ? (
                        <span style={{color: '#16a34a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
                            <CheckCircle size={14}/> CONCLUÍDA
                        </span>
                    ) : (
                        <>
                            <span style={{fontWeight: '500'}}>{op.faseAtualNome}</span>
                            {op.roteiroCodigo && <div style={{fontSize: '0.75rem', color: '#666', marginTop: '2px'}}>Rot: {op.roteiroCodigo}</div>}
                        </>
                    )}
                </td>

                <td>
                  <span className={statusConfig.class}>
                    {statusConfig.label}
                  </span>
                </td>
                
                <td>{new Date(op.dataInicio).toLocaleDateString()}</td>
                
                <td className="acoes-cell">
                  
                  {!isInactive && (
                      <button 
                        className="icon-action"
                        title="Avançar Fase"
                        onClick={() => handleAvancarFase(op.id)}
                        style={{color: '#2563eb', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff'}}
                        disabled={avancarFaseMutation.isPending}
                      >
                        <PlayCircle size={18} />
                      </button>
                  )}

                  {!isInactive && (
                      <button 
                        className="icon-action"
                        title="Concluir Produção (Estoque)"
                        onClick={() => handleFinalizarManual(op.id)}
                        style={{color: '#16a34a', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4'}}
                        disabled={finalizarMutation.isPending}
                      >
                        <CheckCircle size={18} />
                      </button>
                  )}

                  {isFinalizada && <div style={{padding: '8px'}} title="Produção Finalizada"><CheckCircle size={20} color="#16a34a" /></div>}
                  {isCancelada && <div style={{padding: '8px'}} title="Cancelada"><XCircle size={20} color="#991b1b" /></div>}

                  <button 
                    className="icon-action"
                    title="Relatório PDF"
                    onClick={() => handleViewReport(op.id)}
                    style={{color: '#4b5563'}}
                  >
                    <FileText size={18} />
                  </button>
                  
                  <button 
                    className="btn-icon btn-edit" 
                    onClick={() => navigate(`${basePath}/editar/${op.id}`)}
                    disabled={isInactive}
                    style={{opacity: isInactive ? 0.3 : 1}}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  
                  <button 
                    className="btn-icon btn-delete" 
                    onClick={() => handleDelete(op.id)}
                    disabled={deleteMutation.isPending || isInactive}
                    style={{opacity: isInactive ? 0.3 : 1}}
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )})
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
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