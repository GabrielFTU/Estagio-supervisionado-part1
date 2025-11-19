import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import tipoOrdemDeProducaoService from '../../services/tipoOrdemDeProducaoService.js';
import '../../features/produto/ProdutoList.css'; 

function useTiposOP() {
  return useQuery({
    queryKey: ['tiposOrdemDeProducao'],
    queryFn: tipoOrdemDeProducaoService.getAll
  });
}

function TipoOrdemDeProducaoList() {
  const { data: tipos, isLoading, isError, error } = useTiposOP();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: tipoOrdemDeProducaoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposOrdemDeProducao'] });
      alert("Tipo de Ordem de Produção excluído com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao excluir. O tipo pode estar em uso.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este Tipo de Ordem de Produção?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar Tipos de OP: {error.message}</div>;

  const basePath = '/settings/cadastros/tiposop';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Tipos de Ordem de Produção</h1>
        <Link to={`${basePath}/novo`} className="btn-new">+ Novo Tipo de OP</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tipos && tipos.length > 0 ? (
            tipos.map((tipo) => (
              <tr key={tipo.id}>
                <td>{tipo.nome}</td>
                <td>{tipo.codigo}</td>
                <td>
                  <span className={tipo.ativo ? 'status-ativo' : 'status-inativo'}>
                    {tipo.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`${basePath}/editar/${tipo.id}`)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(tipo.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                Nenhum Tipo de Ordem de Produção encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TipoOrdemDeProducaoList;