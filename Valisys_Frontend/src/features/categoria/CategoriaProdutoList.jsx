import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Ban, Search, Filter, ChevronLeft, ChevronRight, Plus, Layers } from 'lucide-react';
import categoriaProdutoService from '../../services/categoriaProdutoService.js';
import '../../features/produto/ProdutoList.css'; 

function useCategorias() {
  return useQuery({
    queryKey: ['categoriasProduto'],
    queryFn: categoriaProdutoService.getAll
  });
}

function CategoriaProdutoList() {
  const { data: categorias, isLoading, isError, error } = useCategorias();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos'); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const deleteMutation = useMutation({
    mutationFn: categoriaProdutoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriasProduto'] });
      alert("Categoria inativada com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao inativar categoria. Verifique se há produtos vinculados.";
      alert(errorMessage);
    }
  });

  const handleInativar = (id) => {
    if (window.confirm("Tem certeza que deseja inativar esta categoria?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredCategorias = useMemo(() => {
    if (!categorias) return [];

    return categorias.filter(cat => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        cat.nome.toLowerCase().includes(searchLower) || 
        cat.codigo.toLowerCase().includes(searchLower);

      let matchesStatus = true;
      if (statusFilter === 'ativos') matchesStatus = cat.ativo === true;
      if (statusFilter === 'inativos') matchesStatus = cat.ativo === false;

      return matchesSearch && matchesStatus;
    });
  }, [categorias, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredCategorias.slice(startIndex, startIndex + itemsPerPage);

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

  if (isLoading) return <div className="loading-message">Carregando categorias...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={28} className="text-primary" />
            Gerenciamento de Categorias
        </h1>
        <Link to="/settings/cadastros/categorias/novo" className="btn-new">
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <Plus size={18} />
                <span>Nova Categoria</span>
            </div>
        </Link>
      </div>

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
            onChange={handleFilterChange}>
                <option value="todos">Todos os Status</option>
                <option value="ativos">Apenas Ativos</option>
                <option value="inativos">Apenas Inativos</option>
            </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{width: '15%'}}>Código</th>
              <th style={{width: '40%'}}>Nome</th>
              <th style={{width: '30%'}}>Descrição</th>
              <th style={{width: '10%'}}>Status</th>
              <th style={{width: '5%'}} className="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((categoria) => (
                <tr key={categoria.id} className={!categoria.ativo ? 'row-inactive' : ''}>
                  <td style={{fontWeight: 'bold'}}>{categoria.codigo}</td>
                  <td>{categoria.nome}</td>
                  <td style={{color: '#666', fontSize: '0.9rem'}}>
                    {categoria.descricao || '-'}
                  </td>
                  <td>
                    <span className={`badge ${categoria.ativo ? 'badge-active' : 'badge-inactive'}`}>
                      {categoria.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="acoes-cell">
                    <button 
                      className="btn-icon btn-edit" 
                      onClick={() => navigate(`/settings/cadastros/categorias/editar/${categoria.id}`)}
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    
                    {categoria.ativo && (
                        <button 
                          className="btn-icon btn-delete" 
                          onClick={() => handleInativar(categoria.id)}
                          disabled={deleteMutation.isPending}
                          title="Inativar"
                        >
                          <Ban size={18} />
                        </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  Nenhuma categoria encontrada com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <span className="pagination-info">
            Página {currentPage} de {totalPages} ({filteredCategorias.length} registros)
          </span>
          <div className="pagination-buttons">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className="page-btn"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriaProdutoList;