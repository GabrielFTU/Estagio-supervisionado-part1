import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, UserPlus, Search, Filter } from 'lucide-react';
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

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

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

  const usuariosFiltrados = useMemo(() => {
    if (!usuarios) return [];

    return usuarios
      .filter((u) =>
        `${u.nome} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((u) =>
        statusFilter === "todos"
          ? true
          : statusFilter === "ativos"
          ? u.ativo
          : !u.ativo
      );
  }, [usuarios, searchTerm, statusFilter]);

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
          <UserPlus size={18} style={{ marginRight: '8px' }} />
          Novo Usuário
        </Link>
      </div>

      <div className="toolbar-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} className="filter-icon" />
          <select
            className="select-standard"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>
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
          {usuariosFiltrados.length > 0 ? (
            usuariosFiltrados.map((usuario) => (
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
