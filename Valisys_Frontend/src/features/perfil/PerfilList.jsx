import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, UserPlus, AlertCircle } from 'lucide-react';
import perfilService from '../../services/perfilService.js';
import '../../features/produto/ProdutoList.css';

function usePerfis() {
  return useQuery({
    queryKey: ['perfis'],
    queryFn: perfilService.getAll,
    retry: 1,
    refetchOnWindowFocus: false
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

  if (isLoading) return <div className="loading-message">Carregando perfis...</div>;
  
  if (isError) {
      return (
          <div className="error-message" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <AlertCircle size={24} />
              <span>
                  Erro ao carregar perfis: {error.message || "Erro desconhecido."}
                  <br />
                  {error.response?.status === 401 ? "Sessão expirada ou sem permissão." : "Verifique se o servidor está rodando."}
              </span>
          </div>
      );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Perfis</h1>
        <Link to="/settings/perfis/novo" className="btn-new">
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <UserPlus size={18} />
                <span>Novo Perfil</span>
            </div>
        </Link>
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
                <td>{perfil.nome || 'Sem Nome'}</td>
                <td>
                  <span className={perfil.ativo ? 'status-ativo' : 'status-inativo'}>
                    {perfil.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`/settings/perfis/editar/${perfil.id}`)}
                    title="Editar Perfil"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(perfil.id)}
                    disabled={deleteMutation.isPending}
                    title="Excluir Perfil"
                  >
                    <Trash2 size={16} />
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