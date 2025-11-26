import React, { useState, useMemo } from 'react'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import fornecedorService from '../../services/fornecedorService.js';
import '../produto/ProdutoList.css'; 
import { Search } from 'lucide-react';

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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Fornecedores</h1>
        <Link to="/settings/cadastros/fornecedores/novo" className="btn-new">+ Novo Fornecedor</Link>
      </div>

      <div className="filter-area" style={{ marginBottom: '20px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'flex-end', backgroundColor: 'var(--bg-secondary)' }}>
        
        <div style={{ flexGrow: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar por Nome, CNPJ ou E-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          />
          <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        </div>

        <div>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(Number(e.target.value))}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          >
            <option value={0}>Todos Tipos</option>
            <option value={1}>Pessoa Física</option>
            <option value={2}>Pessoa Jurídica</option>
          </select>
        </div>

        <div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          >
            <option value="all">Todos Status</option>
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
          {filteredFornecedores.length > 0 ? (
            filteredFornecedores.map((fornecedor) => {
              const tipoDocumento = fornecedor.tipoDocumento || (fornecedor.cnpj || fornecedor.documento || '').length > 11 ? 2 : 1;
              const tipoNome = tipoDocumento === 1 ? 'PF' : 'PJ';

              const nomeFantasia = fornecedor.nomeFantasia || fornecedor.nome || 'N/A';
              const razaoSocial = fornecedor.razaoSocial || fornecedor.nome || 'N/A';
              const documentoExibido = fornecedor.cnpj || fornecedor.documento || 'N/A';

              return (
              <tr key={fornecedor.id}>
                <td>{nomeFantasia}</td> 
                <td>{razaoSocial}</td>
                <td>{documentoExibido}</td>
                <td>{tipoNome}</td> 
                <td>{fornecedor.email}</td>
                <td>
                  <span className={fornecedor.ativo ? 'status-ativo' : 'status-inativo'}>
                    {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`/settings/cadastros/fornecedores/editar/${fornecedor.id}`)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(fornecedor.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            )})
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