import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Ban, UserPlus, AlertCircle, Search, Filter } from 'lucide-react'; 
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

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const deleteMutation = useMutation({
    mutationFn: perfilService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis'] });
      alert("Status do perfil alterado com sucesso!");
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || 
        "Erro ao alterar status. Verifique se há usuários vinculados.";
      alert(errorMessage);
    }
  });

  const handleInativar = (id) => {
    if (window.confirm("Deseja alterar o status (Ativar/Inativar) deste perfil?")) {
      deleteMutation.mutate(id);
    }
  };

  const perfisFiltrados = useMemo(() => {
    if (!perfis) return [];

    return perfis
      .filter((p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((p) =>
        statusFilter === "todos"
          ? true
          : statusFilter === "ativos"
          ? p.ativo
          : !p.ativo
      );
  }, [perfis, searchTerm, statusFilter]);

  if (isLoading) return <div className="loading-message">Carregando perfis...</div>;

  if (isError) {
    return (
      <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertCircle size={24} />
        <span>
          Erro ao carregar perfis: {error.message || "Erro desconhecido."}
        </span>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Perfis</h1>
        <Link to="/settings/perfis/novo" className="btn-new">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <UserPlus size={18} />
            <span>Novo Perfil</span>
          </div>
        </Link>
      </div>

      <div className="toolbar-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome..."
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
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {perfisFiltrados.length > 0 ? (
            perfisFiltrados.map((perfil) => (
              <tr key={perfil.id} className={!perfil.ativo ? 'row-inactive' : ''}>
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
                    onClick={() => handleInativar(perfil.id)}
                    disabled={deleteMutation.isPending}
                    title={perfil.ativo ? "Inativar Perfil" : "Ativar Perfil"}
                  >
                    <Ban size={16} />
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