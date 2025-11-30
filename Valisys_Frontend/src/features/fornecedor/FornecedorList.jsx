import React, { useState, useMemo } from 'react'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import fornecedorService from '../../services/fornecedorService.js';
import '../produto/ProdutoList.css'; 
import { Search, X, Filter } from 'lucide-react';

function useFornecedores() {
  return useQuery({
    queryKey: ['fornecedores'],
    queryFn: fornecedorService.getAll
  });
}

function FornecedorList() {
  const { data: fornecedores, isLoading, isError, error } = useFornecedores();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(0); 
  const [filterStatus, setFilterStatus] = useState('all'); 
  
  const filteredFornecedores = useMemo(() => {
    if (!fornecedores) return [];

    return fornecedores.filter(fornecedor => {
      const searchFields = [
        fornecedor.nomeFantasia, 
        fornecedor.razaoSocial, 
        fornecedor.nome, 
        fornecedor.cnpj, 
        fornecedor.documento,
        fornecedor.email,
      ].map(s => String(s || '').toLowerCase()).join(' ');

      const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      const tipo = fornecedor.tipoDocumento || (fornecedor.cnpj || fornecedor.documento || '').length > 11 ? 2 : 1; 
      if (filterType !== 0 && tipo !== filterType) return false;

      if (filterStatus === 'active' && fornecedor.ativo !== true) return false;
      if (filterStatus === 'inactive' && fornecedor.ativo !== false) return false;

      return true;
    });
  }, [fornecedores, searchTerm, filterType, filterStatus]);

  const deleteMutation = useMutation({
    mutationFn: fornecedorService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      alert("Fornecedor excluído com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao excluir. O fornecedor pode estar em uso.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este fornecedor?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar fornecedores: {error.message}</div>;

  const basePath = '/settings/cadastros/fornecedores';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Fornecedores</h1>
        <Link to="/settings/cadastros/fornecedores/novo" className="btn-new">+ Novo Fornecedor</Link>
      </div>

      <div className="toolbar-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
          {searchTerm && (
            <button className="btn-clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filter-box">
          <Filter size={20} className="filter-icon" />
          <select
            className="select-standard"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
            <th>Nome Fantasia</th>
            <th>Razão Social</th>
            <th>CNPJ/CPF</th>
            <th>Tipo</th>
            <th>E-mail</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredFornecedores && filteredFornecedores.length > 0 ? (
            filteredFornecedores.map((f) => (
              <tr key={f.id}>
                <td>{f.nomeFantasia || '-'}</td>
                <td>{f.razaoSocial || '-'}</td>
                <td>{f.cnpj || f.documento || '-'}</td>
                <td>{(f.tipoDocumento || (String(f.cnpj || f.documento || '').length > 11)) ? 'PJ' : 'PF'}</td>
                <td>{f.email || '-'}</td>
                <td>
                  <span className={f.ativo ? 'status-ativo' : 'status-inativo'}>
                    {f.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button
                    className="btn-editar"
                    onClick={() => navigate(`${basePath}/editar/${f.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-deletar"
                    onClick={() => handleDelete(f.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                Nenhum fornecedor encontrado com os filtros aplicados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FornecedorList;