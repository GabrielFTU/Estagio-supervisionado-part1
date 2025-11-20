import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import usuarioService from '../../services/usuarioService.js';
import '../../features/produto/ProdutoList.css';

function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: usuarioService.getAll,
    retry: 1
  });
}

function UsuarioList() {
  const { data: usuarios, isLoading, isError, error } = useUsuarios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: usuarioService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      alert("Usuário excluído com sucesso!");
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Erro ao excluir o usuário.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando usuários...</div>;
  
  if (isError) {
    return (
        <div className="error-message">
            <h3>Erro ao carregar usuários</h3>
            <p>{error?.message || "Não foi possível conectar ao servidor."}</p>
        </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Usuários</h1>
        <Link to="/settings/usuarios/novo" className="btn-new">
            <UserPlus size={18} style={{marginRight: '8px'}} />
            Novo Usuário
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Perfil</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios && usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.perfilNome || 'Sem Perfil'}</td>
                <td>
                  <span className={usuario.ativo ? 'status-ativo' : 'status-inativo'}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`/settings/usuarios/editar/${usuario.id}`)}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(usuario.id)}
                    disabled={deleteMutation.isPending}
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsuarioList;