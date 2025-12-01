import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Edit, Trash2, PlayCircle, CheckCircle, XCircle, 
  Search, X, Filter, Plus, ClipboardList, Calendar 
} from 'lucide-react'; 
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import '../../features/produto/ProdutoList.css'; 

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

  const basePath = '/producao/op';

  const invalidateList = () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
  };

  const deleteMutation = useMutation({
    mutationFn: ordemDeProducaoService.delete, 
    onSuccess: () => {
      invalidateList();
      alert("Ordem de Produção excluída/cancelada com sucesso!");
    },
    onError: (err) => alert(err.response?.data?.message || "Erro ao excluir.")
  });

  const avancarFaseMutation = useMutation({
    mutationFn: ordemDeProducaoService.avancarFase,
    onSuccess: () => invalidateList(),
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
    if (window.confirm("Tem certeza que deseja cancelar/excluir esta Ordem de Produção?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleAvancarFase = (id) => {
      if(window.confirm("Confirmar avanço de fase?")) {
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

  const getStatusBadge = (statusName) => {
      switch(statusName) {
          case 'Ativa': 
              return <span className="badge" style={{backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe'}}>Ativa</span>;
          case 'Aguardando': 
              return <span className="badge" style={{backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa'}}>Aguardando</span>;
          case 'Finalizada': 
              return <span className="badge" style={{backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0'}}>Finalizada</span>;
          case 'Cancelada': 
              return <span className="badge" style={{backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca'}}>Cancelada</span>;
          default: 
              return <span className="badge">{statusName}</span>;
      }
  };

  const filteredOrdens = useMemo(() => {
    if (!ordens) return [];
    return ordens.filter(op => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q || 
        String(op.codigoOrdem).toLowerCase().includes(q) || 
        String(op.produtoNome || '').toLowerCase().includes(q);
      
      const statusStr = String(op.status); 
      const statusMap = { 1: 'Ativa', 2: 'Aguardando', 3: 'Finalizada', 4: 'Cancelada' };
      const normalizedStatus = statusMap[op.status] || op.status;

      let matchesStatus = true;
      if (statusFilter === 'ativos') matchesStatus = normalizedStatus === 'Ativa' || normalizedStatus === 'Aguardando';
      if (statusFilter === 'finalizados') matchesStatus = normalizedStatus === 'Finalizada';
      if (statusFilter === 'cancelados') matchesStatus = normalizedStatus === 'Cancelada';

      return matchesSearch && matchesStatus;
    });
  }, [ordens, searchTerm, statusFilter]);

  if (isLoading) return <div className="loading-message">Carregando Ordens de Produção...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={28} className="text-primary" />
            Ordens de Produção
        </h1>
        <Link to={`${basePath}/novo`} className="btn-new">
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <Plus size={18} />
                <span>Nova Ordem</span>
            </div>
        </Link>
      </div>

      <div className="toolbar-container">
        <div className="search-box">
            <Search size={20} className="search-icon" />
            <input 
                type="text" 
                placeholder="Buscar por código (OP), produto..." 
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
                <option value="ativos">Em Andamento (Ativas)</option>
                <option value="finalizados">Finalizadas</option>
                <option value="cancelados">Canceladas</option>
            </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{width: '15%'}}>Código OP</th>
              <th style={{width: '25%'}}>Produto</th>
              <th style={{width: '10%'}}>Qtd.</th>
              <th style={{width: '15%'}}>Fase Atual</th>
              <th style={{width: '10%'}}>Status</th>
              <th style={{width: '10%'}}>Início</th>
              <th style={{width: '15%'}} className="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrdens.length > 0 ? (
              filteredOrdens.map((op) => {
                const statusMap = { 1: 'Ativa', 2: 'Aguardando', 3: 'Finalizada', 4: 'Cancelada' };
                const statusStr = statusMap[op.status] || op.status;
                
                const isFinalizada = statusStr === 'Finalizada';
                const isCancelada = statusStr === 'Cancelada';
                const isEditable = !isFinalizada && !isCancelada;

                return (
                  <tr key={op.id} className={!isEditable ? 'row-inactive' : ''}>
                    <td style={{fontWeight: 'bold', color: 'var(--color-primary)'}}>{op.codigoOrdem}</td>
                    <td>{op.produtoNome}</td>
                    <td style={{fontWeight: 'bold'}}>{op.quantidade}</td>
                    
                    <td>
                        {isFinalizada ? (
                            <span style={{color: '#15803d', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                                <CheckCircle size={14}/> Concluída
                            </span>
                        ) : (
                            <>
                                <span style={{fontWeight: '500'}}>{op.faseAtualNome}</span>
                                {op.roteiroCodigo && <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px'}}>Rot: {op.roteiroCodigo}</div>}
                            </>
                        )}
                    </td>

                    <td>{getStatusBadge(statusStr)}</td>
                    
                    <td style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                            <Calendar size={14}/>
                            {new Date(op.dataInicio).toLocaleDateString()}
                        </div>
                    </td>
                    
                    <td className="acoes-cell">
                      
                      {isEditable && (
                          <button 
                            className="icon-action"
                            title="Avançar para Próxima Fase"
                            onClick={() => handleAvancarFase(op.id)}
                            style={{color: '#2563eb', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe'}}
                            disabled={avancarFaseMutation.isPending}
                          >
                            <PlayCircle size={18} />
                          </button>
                      )}

                      {isEditable && (
                          <button 
                            className="icon-action"
                            title="Concluir Produção (Gerar Estoque)"
                            onClick={() => handleFinalizarManual(op.id)}
                            style={{color: '#16a34a', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0'}}
                            disabled={finalizarMutation.isPending}
                          >
                            <CheckCircle size={18} />
                          </button>
                      )}

                      <button 
                        className="icon-action"
                        title="Imprimir Relatório / Ficha"
                        onClick={() => handleViewReport(op.id)}
                        style={{color: '#4b5563'}}
                      >
                        <FileText size={18} />
                      </button>
                      
                      <button 
                        className="btn-icon btn-edit" 
                        onClick={() => navigate(`${basePath}/editar/${op.id}`)}
                        disabled={!isEditable}
                        style={{opacity: !isEditable ? 0.5 : 1, cursor: !isEditable ? 'not-allowed' : 'pointer'}}
                        title={isEditable ? "Editar O.P." : "Somente Leitura"}
                      >
                        <Edit size={18} />
                      </button>
                      
                      <button 
                        className="btn-icon btn-delete" 
                        onClick={() => handleDelete(op.id)}
                        disabled={deleteMutation.isPending || !isEditable} 
                        style={{opacity: (!isEditable) ? 0.5 : 1, cursor: !isEditable ? 'not-allowed' : 'pointer'}}
                        title="Cancelar O.P."
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">
                  Nenhuma Ordem de Produção encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdemDeProducaoList;