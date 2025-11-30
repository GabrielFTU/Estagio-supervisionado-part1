import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Layers, Plus } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const deleteMutation = useMutation({
    mutationFn: tipoOrdemDeProducaoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposOrdemDeProducao'] });
      alert("Tipo OP excluído com sucesso!");
    },
    onError: () => alert("Erro ao excluir.")
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza?")) deleteMutation.mutate(id);
  };

  const basePath = '/settings/cadastros/tiposop';

  const filteredTipos = useMemo(() => {
    if (!tipos) return [];

    const q = searchTerm.toLowerCase();

    return tipos.filter(t => {
      const text = `${t.nome} ${t.codigo}`.toLowerCase();
      const matchesSearch = text.includes(q);
      const matchesStatus =
        filterStatus === 'all'
          ? true
          : filterStatus === 'active'
          ? t.ativo
          : !t.ativo;

      return matchesSearch && matchesStatus;
    });
  }, [tipos, searchTerm, filterStatus]);

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>Gerenciamento de Tipos de Ordem de Produção</h1>
        <Link to={`${basePath}/novo`} className="btn-new">
          + Novo Tipo de OP
        </Link>
      </div>

      {/* TOOLBAR MANUAL */}
      <div className="toolbar-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
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
            <option value="all">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
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
          {filteredTipos.length > 0 ? (
            filteredTipos.map(tipo => (
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
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-state">
                Nenhum Tipo de OP encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TipoOrdemDeProducaoList;
