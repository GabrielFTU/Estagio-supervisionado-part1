import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
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

  const getStatusBadge = (statusId) => {
      switch(statusId) {
          case 1: return <span className="badge" style={{backgroundColor: '#fef08a', color: '#854d0e'}}>Pendente</span>;
          case 2: return <span className="badge" style={{backgroundColor: '#bbf7d0', color: '#166534'}}>Concluído</span>;
          case 3: return <span className="badge" style={{backgroundColor: '#fecaca', color: '#991b1b'}}>Cancelado</span>;
          case 4: return <span className="badge" style={{backgroundColor: '#bfdbfe', color: '#1e40af'}}>Em Produção</span>;
          default: return <span className="badge">Desconhecido</span>;
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
            lotes.map((lote) => (
              <tr key={lote.id}>
                <td style={{fontWeight: 'bold'}}>{lote.numeroLote || lote.codigoLote}</td>
                <td>{lote.produtoNome || '-'}</td>
                <td>{lote.almoxarifadoNome || '-'}</td>
                <td>{getStatusBadge(lote.statusLote || 1)}</td>
                <td>{new Date(lote.dataAbertura || lote.dataFabricacao).toLocaleDateString()}</td>
                <td className="acoes-cell">
                  <button 
                    className="btn-icon btn-edit" 
                    onClick={() => navigate(`/producao/lotes/editar/${lote.id}`)}
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="btn-icon btn-delete" 
                    onClick={() => handleDelete(lote.id)}
                    disabled={deleteMutation.isPending}
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-state">
                Nenhum lote registado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LoteList;