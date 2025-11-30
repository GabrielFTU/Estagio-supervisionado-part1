import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Layers, Plus } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos'); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const deleteMutation = useMutation({
    mutationFn: faseProducaoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasesProducao'] });
      alert("Fase de Produção excluída com sucesso!");
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Erro ao excluir. A fase pode estar em uso.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta Fase de Produção?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredFases = useMemo(() => {
    if (!fases) return [];
    const searchLower = searchTerm.toLowerCase();

    return fases.filter(fase => {
      const matchesSearch =
        fase.nome.toLowerCase().includes(searchLower) ||
        String(fase.codigo || '').toLowerCase().includes(searchLower);

      let matchesStatus = true;
      if (statusFilter === 'ativos') matchesStatus = fase.ativo === true;
      if (statusFilter === 'inativos') matchesStatus = fase.ativo === false;

      return matchesSearch && matchesStatus;
    });
  }, [fases, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredFases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredFases.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const basePath = "/settings/cadastros/fasesproducao";

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">

      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={28} className="text-primary" />
          Gerenciamento de Fases
        </h1>

        <Link to={`${basePath}/novo`} className="btn-new">
          <Plus size={18} />
          Nova Fase
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
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} className="filter-icon" />
          <select 
            className="select-standard"
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <option value="todos">Todos os Status</option>
            <option value="ativos">Apenas Ativos</option>
            <option value="inativos">Apenas Inativos</option>
          </select>
        </div>
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
          {currentData.length > 0 ? (
            currentData.map(fase => (
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
                Nenhuma Fase encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default FaseProducaoList;