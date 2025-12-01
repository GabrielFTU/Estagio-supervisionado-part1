import React, { useState, useMemo } from 'react'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Filter, Edit, Ban, User, Building2, Plus } from 'lucide-react';
import fornecedorService from '../../services/fornecedorService.js';
import '../../features/produto/ProdutoList.css'; 

const formatarDocumento = (doc) => {
    const limpo = (doc || '').replace(/\D/g, '');
    
    if (limpo.length === 11) { 
        return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (limpo.length === 14) { 
        return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc; 
};

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
  const [filterType, setFilterType] = useState('0');
  const [filterStatus, setFilterStatus] = useState('all'); 
  
  const statusMutation = useMutation({
    mutationFn: fornecedorService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      alert("Status do fornecedor alterado com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao alterar status.";
      alert(errorMessage);
    }
  });

  const handleStatusChange = (id, ativo) => {
    const acao = ativo ? "inativar" : "ativar";
    if (window.confirm(`Deseja realmente ${acao} este fornecedor?`)) {
      statusMutation.mutate(id);
    }
  };

  const filteredFornecedores = useMemo(() => {
    if (!fornecedores) return [];

    return fornecedores.filter(fornecedor => {
      const searchFields = [
        fornecedor.nome, 
        fornecedor.documento,
        fornecedor.email,
      ].map(s => String(s || '').toLowerCase()).join(' ');

      const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (filterType !== '0' && String(fornecedor.tipoDocumento) !== filterType) return false;

      if (filterStatus === 'active' && fornecedor.ativo !== true) return false;
      if (filterStatus === 'inactive' && fornecedor.ativo !== false) return false;

      return true;
    });
  }, [fornecedores, searchTerm, filterType, filterStatus]);

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar: {error.message}</div>;

  const basePath = '/settings/cadastros/fornecedores';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={28} className="text-primary" />
            Gerenciamento de Fornecedores
        </h1>
        <Link to={`${basePath}/novo`} className="btn-new">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Plus size={18} />
                <span>Novo Fornecedor</span>
            </div>
        </Link>
      </div>

      <div className="toolbar-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome, documento ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
            >
                <option value="0">Todos os Tipos</option>
                <option value="1">Pessoa Física</option>
                <option value="2">Pessoa Jurídica</option>
            </select>
        </div>

        <div className="filter-box">
          <Filter size={20} className="filter-icon" />
          <select
            className="select-standard"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{width: '60px', textAlign: 'center'}}>Tipo</th>
            <th>Nome / Razão Social</th>
            <th>Documento</th>
            <th>E-mail</th>
            <th>Status</th>
            <th style={{width: '100px'}}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredFornecedores && filteredFornecedores.length > 0 ? (
            filteredFornecedores.map((f) => {
                const isPJ = f.tipoDocumento === 2;
                return (
                  <tr key={f.id} className={!f.ativo ? 'row-inactive' : ''}>
                    <td style={{textAlign: 'center'}}>
                        {isPJ ? (
                            <div title="Pessoa Jurídica" style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', padding: '6px', borderRadius: '50%', color: '#1e40af'}}>
                                <Building2 size={16} />
                            </div>
                        ) : (
                            <div title="Pessoa Física" style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4', padding: '6px', borderRadius: '50%', color: '#15803d'}}>
                                <User size={16} />
                            </div>
                        )}
                    </td>
                    <td>
                        <div style={{fontWeight: '600', color: 'var(--text-primary)'}}>{f.nome}</div>
                        {isPJ && f.nomeFantasia && f.nomeFantasia !== f.nome && (
                            <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{f.nomeFantasia}</div>
                        )}
                    </td>
                    <td style={{fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)'}}>
                        {formatarDocumento(f.documento)}
                    </td>
                    <td>{f.email || '-'}</td>
                    <td>
                      <span className={f.ativo ? 'status-ativo' : 'status-inativo'}>
                        {f.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="acoes-cell">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => navigate(`${basePath}/editar/${f.id}`)}
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleStatusChange(f.id, f.ativo)}
                        disabled={statusMutation.isPending}
                        title={f.ativo ? "Inativar Fornecedor" : "Ativar Fornecedor"}
                      >
                        <Ban size={18} />
                      </button>
                    </td>
                  </tr>
                );
            })
          ) : (
            <tr>
              <td colSpan="6" className="empty-state">
                Nenhum fornecedor encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FornecedorList;