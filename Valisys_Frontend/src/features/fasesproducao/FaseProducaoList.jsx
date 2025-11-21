import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import faseProducaoService from '../../services/faseProducaoService.js';
import '../../features/produto/ProdutoList.css'; 

function useFasesProducao() {
  return useQuery({
    queryKey: ['fasesProducao'],
    queryFn: faseProducaoService.getAll
  });
}

function FaseProducaoList() {
  const { data: fases, isLoading, isError, error } = useFasesProducao();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: faseProducaoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasesProducao'] });
      alert("Fase de Produção excluída com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao excluir. A fase pode estar em uso.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta Fase de Produção?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar Fases de Produção: {error.message}</div>;

  const basePath = '/settings/cadastros/fases';

  const orderedFases = fases ? [...fases].sort((a, b) => a.ordem - b.ordem) : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Fases de Produção</h1>
        <Link to={`${basePath}/novo`} className="btn-new">+ Nova Fase</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>Ordem</th>
            <th>Nome</th>
            <th>Duração (Dias)</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orderedFases.length > 0 ? (
            orderedFases.map((fase) => (
              <tr key={fase.id}>
                <td>{fase.ordem}</td>
                <td>{fase.nome}</td>
                <td>{fase.tempoPadraoDias} dias</td> 
                <td>
                  <span className={fase.ativo ? 'status-ativo' : 'status-inativo'}>
                    {fase.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`${basePath}/editar/${fase.id}`)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(fase.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                Nenhuma Fase de Produção encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FaseProducaoList;