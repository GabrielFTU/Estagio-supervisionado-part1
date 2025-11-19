import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import unidadeMedidaService from '../../services/unidadeMedidaService.js';
import '../../features/produto/ProdutoList.css'; 

function useUnidadesMedida() {
  return useQuery({
    queryKey: ['unidadesMedida'],
    queryFn: unidadeMedidaService.getAll
  });
}

function UnidadeMedidaList() {
  const { data: unidades, isLoading, isError, error } = useUnidadesMedida();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: unidadeMedidaService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidadesMedida'] });
      alert("Unidade de Medida excluída com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao excluir. A unidade pode estar em uso em Produtos.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta Unidade de Medida?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar Unidades de Medida: {error.message}</div>;

  const basePath = '/settings/cadastros/unidades';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Unidades de Medida</h1>
        <Link to={`${basePath}/novo`} className="btn-new">+ Nova Unidade</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sigla</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {unidades && unidades.length > 0 ? (
            unidades.map((unidade) => (
              <tr key={unidade.id}>
                <td>{unidade.nome}</td>
                <td>{unidade.sigla}</td>
                <td className="acoes-cell">
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`${basePath}/editar/${unidade.id}`)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(unidade.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                Nenhuma Unidade de Medida encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UnidadeMedidaList;