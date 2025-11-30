import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Ruler, Edit, Trash2, Plus } from 'lucide-react';
import unidadeMedidaService from '../../services/unidadeMedidaService.js';
import '../../features/produto/ProdutoList.css'; 

const GRANDEZAS_LABEL = {
  0: 'Unidade',
  1: 'Massa',
  2: 'Comprimento',
  3: 'Volume',
  4: 'Tempo',
  5: 'Área'
};

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const deleteMutation = useMutation({
    mutationFn: unidadeMedidaService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidadesMedida'] });
      alert("Unidade excluída!");
    },
    onError: () => alert("Erro ao excluir.")
  });

  const handleDelete = (id) => {
    if (window.confirm("Excluir unidade?")) deleteMutation.mutate(id);
  };

  const filtered = useMemo(() => {
    if (!unidades) return [];

    const q = searchTerm.toLowerCase();

    return unidades.filter(u => {
      const text = `${u.sigla} ${u.nome}`.toLowerCase();
      const matchesSearch = text.includes(q);
      const matchesStatus =
        filterStatus === 'all'
          ? true
          : filterStatus === 'active'
          ? u.ativo
          : !u.ativo;

      return matchesSearch && matchesStatus;
    });
  }, [unidades, searchTerm, filterStatus]);

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  const basePath = "/settings/cadastros/unidades";

  return (
    <div className="page-container">

      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Ruler size={28} className="text-primary" />
          Unidades de Medida
        </h1>

        <Link to={`${basePath}/novo`} className="btn-new">
          <Plus size={18} />
          Nova Unidade
        </Link>
      </div>

      {/* TOOLBAR MANUAL */}
      <div className="toolbar-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text"
            placeholder="Buscar por sigla ou nome..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} className="filter-icon" />
          <select
            className="select-standard"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Sigla</th>
            <th>Nome</th>
            <th>Grandeza</th>
            <th>Fator</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length > 0 ? (
            filtered.map(u => (
              <tr key={u.id}>
                <td><strong>{u.sigla}</strong></td>
                <td>{u.nome}</td>
                <td>{GRANDEZAS_LABEL[u.grandeza]}</td>
                <td>{u.ehUnidadeBase ? "BASE (1.0)" : u.fatorConversao}</td>

                <td className="acoes-cell">
                  <button 
                    className="btn-editar"
                    onClick={() => navigate(`${basePath}/editar/${u.id}`)}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    className="btn-deletar"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="empty-state">Nenhuma Unidade encontrada.</td></tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default UnidadeMedidaList;