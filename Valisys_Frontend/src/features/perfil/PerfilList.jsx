import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import perfilService from '../../services/perfilService.js';
import '../../features/produto/ProdutoList.css';

function usePerfis() {
  return useQuery({
    queryKey: ['perfis'],
    queryFn: perfilService.getAll
  });
}

function PerfilList() {
  const { data: perfis, isLoading, isError, error } = usePerfis();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: perfilService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis'] });
      alert("Perfil excluído com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao excluir. Verifique se há usuários vinculados.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este perfil?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar perfis: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Perfis</h1>
        <Link to="/configuracoes/perfis/novo" className="btn-new">+ Novo Perfil</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {perfis && perfis.length > 0 ? (
            perfis.map((perfil) => (
              <tr key={perfil.id}>
                <td>{perfil.nome}</td>
                <td>
                  <span className={perfil.ativo ? 'status-ativo' : 'status-inativo'}>
                    {perfil.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`/configuracoes/perfis/editar/${perfil.id}`)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(perfil.id)}
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
                Nenhum perfil encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PerfilList;