import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, Edit } from 'lucide-react';
import fichaTecnicaService from '../../services/fichaTecnicaService.js';
import '../../features/produto/ProdutoList.css';

function FichaTecnicaList() {
  const { data: fichas, isLoading, isError, error } = useQuery({
    queryKey: ['fichasTecnicas'],
    queryFn: fichaTecnicaService.getAll
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: fichaTecnicaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fichasTecnicas'] });
      alert("Ficha Técnica removida com sucesso.");
    },
    onError: (err) => {
      console.error(err);
      alert(`Não foi possível excluir a ficha: ${err.response?.data?.message || err.message}`);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Atenção: Tem certeza que deseja remover esta Ficha Técnica? Esta ação não pode ser desfeita.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando registros...</div>;
  if (isError) return <div className="error-message">Ocorreu um erro ao carregar os dados: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Fichas Técnicas</h1>
        <Link to="/engenharia/fichas-tecnicas/novo" className="btn-new">
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <Plus size={18} />
                <span>Nova Ficha</span>
            </div>
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto (Pai)</th>
            <th>Versão</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fichas && fichas.length > 0 ? (
            fichas.map((ft) => (
              <tr key={ft.id}>
                <td><strong>{ft.codigo}</strong></td>
                <td>{ft.produtoNome}</td>
                <td>{ft.versao}</td>
                <td>
                  <span className={ft.ativa ? 'status-ativo' : 'status-inativo'}>
                    {ft.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => navigate(`/engenharia/fichas-tecnicas/visualizar/${ft.id}`)}
                    title="Visualizar Detalhes"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => navigate(`/engenharia/fichas-tecnicas/editar/${ft.id}`)}
                    title="Editar Ficha"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(ft.id)}
                    disabled={deleteMutation.isPending}
                    title="Excluir Ficha"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty-state">
                Não há fichas técnicas cadastradas no momento. Clique em "Nova Ficha" para iniciar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FichaTecnicaList;