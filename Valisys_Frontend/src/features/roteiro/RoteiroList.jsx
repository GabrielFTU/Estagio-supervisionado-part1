import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Edit } from 'lucide-react';
import roteiroProducaoService from '../../services/roteiroProducaoService.js';
import '../../features/produto/ProdutoList.css';

function RoteiroList() {
  const { data: roteiros, isLoading, isError, error } = useQuery({
    queryKey: ['roteirosProducao'],
    queryFn: roteiroProducaoService.getAll
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: roteiroProducaoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roteirosProducao'] });
      alert("Roteiro excluído com sucesso!");
    },
    onError: (err) => alert(`Erro ao excluir: ${err.response?.data?.message || err.message}`)
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este Roteiro?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando Roteiros...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Roteiros de Produção</h1>
        <Link to="/engenharia/roteiros/novo" className="btn-new">
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <Plus size={18} /> <span>Novo Roteiro</span>
            </div>
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Versão</th>
            <th style={{textAlign: 'center'}}>Etapas</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {roteiros && roteiros.length > 0 ? (
            roteiros.map((r) => (
              <tr key={r.id}>
                <td>{r.codigo}</td>
                <td>{r.produtoNome}</td>
                <td>{r.versao}</td>
                <td style={{textAlign: 'center'}}>{r.etapas ? r.etapas.length : 0}</td>
                <td>
                  <span className={r.ativo ? 'status-ativo' : 'status-inativo'}>
                    {r.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => navigate(`/engenharia/roteiros/editar/${r.id}`)}
                    title="Editar Roteiro"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(r.id)}
                    disabled={deleteMutation.isPending}
                    title="Excluir Roteiro"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-state">
                Nenhum roteiro de produção cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RoteiroList;