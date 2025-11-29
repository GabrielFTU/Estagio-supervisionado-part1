import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Search, X, Filter, Plus } from 'lucide-react'; 
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
  const [statusFilter, setStatusFilter] = useState('all');

  const deleteMutation = useMutation({
    mutationFn: loteService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      alert("Lote excluído com sucesso!");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Erro ao excluir o lote. Verifique se não há OPs vinculadas.";
      alert(msg);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem a certeza que deseja excluir este Lote?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (statusStr) => {
      if (!statusStr) return <span className="badge">Indefinido</span>;

      switch(statusStr) {
          case 'Pendente': 
              return <span className="badge" style={{backgroundColor: '#fef08a', color: '#854d0e'}}>Pendente</span>;
          case 'Concluido': 
              return <span className="badge" style={{backgroundColor: '#bbf7d0', color: '#166534'}}>Concluído</span>;
          case 'Cancelado': 
              return <span className="badge" style={{backgroundColor: '#fecaca', color: '#991b1b'}}>Cancelado</span>;
          case 'EmProducao': 
              return <span className="badge" style={{backgroundColor: '#bfdbfe', color: '#1e40af'}}>Em Produção</span>;
          default: 
              return <span className="badge">{statusStr}</span>;
      }
  };

  if (isLoading) return <div className="loading-message">Carregando lotes...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Lotes</h1>
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
            <th>Almoxarifado</th>
            <th>Status</th>
            <th>Data Abertura</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {lotes && lotes.length > 0 ? (
            (lotes || []).filter(lote => {
              const q = (searchTerm || '').toLowerCase();
              const matchesSearch = !q || String(lote.numeroLote).toLowerCase().includes(q) || String(lote.produtoNome || '').toLowerCase().includes(q);
              const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'ativo' ? (lote.status !== 'Concluido' && lote.status !== 'Cancelado') : (lote.status === 'Concluido' || lote.status === 'Cancelado'));
              return matchesSearch && matchesStatus;
            }).map((lote) => {
              const isConcluido = lote.status === 'Concluido';

              return (
                <tr key={lote.id}>
                  <td style={{fontWeight: 'bold'}}>{lote.numeroLote}</td>
                  <td>{lote.produtoNome || '-'}</td>
                  <td>{lote.almoxarifadoNome || '-'}</td>
                  <td>{getStatusBadge(lote.status)}</td>
                  <td>{new Date(lote.dataFabricacao || lote.dataAbertura || Date.now()).toLocaleDateString()}</td>
                  
                  <td className="acoes-cell">
                    <button 
                      className={`btn-icon btn-edit ${isConcluido ? 'disabled' : ''}`}
                      onClick={() => !isConcluido && navigate(`/producao/lotes/editar/${lote.id}`)}
                      title={isConcluido ? "Lote concluído não pode ser editado" : "Editar"}
                      disabled={isConcluido} 
                      style={{ opacity: isConcluido ? 0.5 : 1, cursor: isConcluido ? 'not-allowed' : 'pointer' }}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => handleDelete(lote.id)}
                      disabled={deleteMutation.isPending || isConcluido} 
                      style={{ opacity: (deleteMutation.isPending || isConcluido) ? 0.5 : 1 }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="empty-state">
                Nenhum lote registrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LoteList;