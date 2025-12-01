import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Ban, Search, X, Filter, Plus, Archive } from 'lucide-react'; 
import loteService from '../../services/loteService.js';
import '../../features/produto/ProdutoList.css';

function useLotes() {
  return useQuery({
    queryKey: ['lotes'],
    queryFn: loteService.getAll
  });
}

function LoteList() {
  const { data: lotes, isLoading, isError, error } = useLotes();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos'); 
  const cancelMutation = useMutation({
    mutationFn: loteService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      alert("Lote cancelado com sucesso!");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Erro ao cancelar o lote. Verifique se não há OPs vinculadas.";
      alert(msg);
    }
  });

  const handleCancel = (id) => {
    if (window.confirm("Tem certeza que deseja CANCELAR este Lote? O registro será mantido como histórico.")) {
      cancelMutation.mutate(id);
    }
  };

  const getStatusBadge = (statusStr) => {
      if (!statusStr) return <span className="badge">Indefinido</span>;

      switch(statusStr) {
          case 'Pendente': 
              return <span className="badge" style={{backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa'}}>Pendente</span>;
          case 'EmProducao': 
              return <span className="badge" style={{backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe'}}>Em Produção</span>;
          case 'Concluido': 
              return <span className="badge" style={{backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0'}}>Concluído</span>;
          case 'Cancelado': 
              return <span className="badge" style={{backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca'}}>Cancelado</span>;
          default: 
              return <span className="badge">{statusStr}</span>;
      }
  };

  const filteredLotes = useMemo(() => {
    if (!lotes) return [];

    return lotes.filter(lote => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q || 
        String(lote.numeroLote).toLowerCase().includes(q) || 
        String(lote.produtoNome || '').toLowerCase().includes(q);
      
      const status = lote.status; 
      
      let matchesFilter = true;
      if (statusFilter === 'ativos') {
          matchesFilter = status === 'Pendente' || status === 'EmProducao';
      } else if (statusFilter === 'inativos') {
          matchesFilter = status === 'Concluido' || status === 'Cancelado';
      }

      return matchesSearch && matchesFilter;
    });
  }, [lotes, searchTerm, statusFilter]);

  if (isLoading) return <div className="loading-message">Carregando lotes...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Archive size={28} className="text-primary" />
            Gerenciamento de Lotes
        </h1>
        <Link to="/producao/lotes/novo" className="btn-new">
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <Plus size={18} />
                <span>Novo Lote</span>
            </div>
        </Link>
      </div>

      <div className="toolbar-container">
        <div className="search-box">
            <Search size={20} className="search-icon" />
            <input 
                type="text" 
                placeholder="Buscar por número do lote ou produto..." 
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
                <option value="todos">Todos os Lotes</option>
                <option value="ativos">Apenas Ativos (Em uso)</option>
                <option value="inativos">Histórico (Concluídos/Cancelados)</option>
            </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
            <thead>
            <tr>
                <th style={{width: '15%'}}>Código / Lote</th>
                <th style={{width: '30%'}}>Produto</th>
                <th style={{width: '20%'}}>Localização</th>
                <th style={{width: '15%'}}>Status</th>
                <th style={{width: '10%'}}>Criação</th>
                <th style={{width: '10%'}} className="actions-column">Ações</th>
            </tr>
            </thead>
            <tbody>
            {filteredLotes.length > 0 ? (
                filteredLotes.map((lote) => {
                const isFinished = lote.status === 'Concluido';
                const isCancelled = lote.status === 'Cancelado';
                const isEditable = !isFinished && !isCancelled;

                return (
                    <tr key={lote.id} className={!isEditable ? 'row-inactive' : ''}>
                        <td style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>
                            {lote.numeroLote}
                        </td>
                        <td>{lote.produtoNome || '-'}</td>
                        <td style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                            {lote.almoxarifadoNome || '-'}
                        </td>
                        <td>{getStatusBadge(lote.status)}</td>
                        <td style={{fontSize: '0.85rem'}}>
                            {new Date(lote.dataFabricacao || lote.dataAbertura).toLocaleDateString()}
                        </td>
                        
                        <td className="acoes-cell">
                            <button 
                                className="btn-icon btn-edit"
                                onClick={() => navigate(`/producao/lotes/editar/${lote.id}`)}
                                title={isEditable ? "Editar Lote" : "Visualizar (Somente Leitura)"}
                                disabled={!isEditable && !isFinished}
                                style={{ 
                                    opacity: isEditable ? 1 : 0.5, 
                                    cursor: isEditable ? 'pointer' : 'default' 
                                }}
                            >
                                <Edit size={18} />
                            </button>

                            <button 
                                className="btn-icon btn-delete" 
                                onClick={() => handleCancel(lote.id)}
                                disabled={!isEditable || cancelMutation.isPending} 
                                title={isEditable ? "Cancelar Lote" : "Lote já finalizado/cancelado"}
                                style={{ 
                                    opacity: isEditable ? 1 : 0.3,
                                    cursor: isEditable ? 'pointer' : 'not-allowed',
                                    color: isEditable ? '#ef4444' : 'var(--text-secondary)'
                                }}
                            >
                                <Ban size={18} />
                            </button>
                        </td>
                    </tr>
                );
                })
            ) : (
                <tr>
                <td colSpan="6" className="empty-state">
                    Nenhum lote encontrado com os filtros atuais.
                </td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default LoteList;