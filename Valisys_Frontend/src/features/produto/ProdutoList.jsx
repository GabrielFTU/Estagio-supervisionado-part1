import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Edit, Trash2, Ban } from 'lucide-react';
import produtoService from '../../services/produtoService.js';
import './ProdutoList.css';

function useProdutos() {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: produtoService.getAll
  });
}

function ProdutoList() {
  const { data: produtos, isLoading, isError, error } = useProdutos();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ativos'); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const deleteMutation = useMutation({
    mutationFn: produtoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      alert("Produto inativado com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      alert("Erro ao inativar o produto.");
    }
  });

  const handleInactivate = (id) => {
    if (window.confirm("Deseja realmente inativar este produto? Ele não aparecerá mais nas listagens de produção.")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProdutos = useMemo(() => {
    if (!produtos) return [];
    
    return produtos.filter(produto => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        produto.nome.toLowerCase().includes(searchLower) || 
        produto.codigo.toLowerCase().includes(searchLower);

      let matchesStatus = true;
      if (statusFilter === 'ativos') matchesStatus = produto.ativo === true;
      if (statusFilter === 'inativos') matchesStatus = produto.ativo === false;

      return matchesSearch && matchesStatus;
    });
  }, [produtos, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredProdutos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProdutos = filteredProdutos.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Produtos</h1>
        <Link to="/estoque/produtos/novo" className="btn-new">+ Adicionar Produto</Link>
      </div>

      <div className="toolbar-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou código..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} className="filter-icon" />
          <select 
            className="select-standard"
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="todos">Todos</option>
            <option value="ativos">Somente Ativos</option>
            <option value="inativos">Somente Inativos</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Referencia</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Un.</th>
              <th>Status</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentProdutos.length > 0 ? (
              currentProdutos.map((produto) => (
                <tr key={produto.id} className={!produto.ativo ? 'row-inactive' : ''}>
                  <td>{produto.codigo}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.categoriaProdutoNome}</td>
                  <td>{produto.unidadeMedidaSigla}</td>
                  <td>
                    <span className={`badge ${produto.ativo ? 'badge-active' : 'badge-inactive'}`}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="acoes-cell">
                    <button 
                      className="btn-icon btn-edit" 
                      onClick={() => navigate(`/estoque/produtos/editar/${produto.id}`)}
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    
                    {produto.ativo && (
                      <button 
                        className="btn-icon btn-delete" 
                        onClick={() => handleInactivate(produto.id)}
                        title="Inativar"
                        disabled={deleteMutation.isPending}
                      >
                        <Ban size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <span className="pagination-info">
            Página {currentPage} de {totalPages} ({filteredProdutos.length} itens)
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

export default ProdutoList;