import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, Edit, Search, X, Filter, Ban } from 'lucide-react';
import fichaTecnicaService from '../../services/fichaTecnicaService.js';
import '../../features/produto/ProdutoList.css';

function FichaTecnicaList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ativo');
  const { data: fichas, isLoading, isError, error } = useQuery({
    queryKey: ['fichasTecnicas'],
    queryFn: fichaTecnicaService.getAll
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const inativarMutation = useMutation({
    mutationFn: fichaTecnicaService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fichasTecnicas'] });
      alert("Ficha Técnica inativada com sucesso.");
    },
    onError: (err) => {
      console.error(err);
      alert(`Não foi possível inativar a ficha: ${err.response?.data?.message || err.message}`);
    }
  });

  const handleInativar = (id) => {
    if (window.confirm("Atenção: Deseja realmente inativar esta Ficha Técnica? Ela não poderá ser usada em novas Ordens de Produção.")) {
      inativarMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando registros...</div>;
  if (isError) return <div className="error-message">Ocorreu um erro ao carregar os dados: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Fichas Técnicas</h1>
        <Link to="/engenharia/fichas-tecnicas/novo" className="btn-new">
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <Plus size={18} />
                <span>Nova Ficha</span>
            </div>
        </Link>
      </div>

      <div className="toolbar-container">
        <div className="search-box">
            <Search size={20} className="search-icon" />
            <input 
                type="text" 
                placeholder="Buscar por código ou produto..." 
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
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">Todos os Status</option>
                <option value="ativo">Apenas Ativos</option>
                <option value="inativos">Apenas Inativos</option>
            </select>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto (Pai)</th>
            <th>Versão</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fichas && fichas.length > 0 ? (
            (fichas || []).filter(ft => {
              const matchesSearch = !searchTerm || 
                (ft.codigo && String(ft.codigo).toLowerCase().includes(searchTerm.toLowerCase())) ||
                (ft.produtoNome && String(ft.produtoNome).toLowerCase().includes(searchTerm.toLowerCase()));
              
              const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'ativo' ? ft.ativa : !ft.ativa);
              return matchesSearch && matchesStatus;
            }).map((ft) => (
              <tr key={ft.id} className={!ft.ativa ? 'row-inactive' : ''}>
                <td><strong>{ft.codigo}</strong></td>
                <td>{ft.produtoNome}</td>
                <td>{ft.versao}</td>
                <td>
                  <span className={ft.ativa ? 'status-ativo' : 'status-inativo'}>
                    {ft.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => navigate(`/engenharia/fichas-tecnicas/visualizar/${ft.id}`)}
                    title="Visualizar Detalhes"
                  >
                    <Eye size={18} />
                  </button>
                  
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => navigate(`/engenharia/fichas-tecnicas/editar/${ft.id}`)}
                    title="Editar Ficha"
                    disabled={!ft.ativa}
                    style={{ opacity: !ft.ativa ? 0.5 : 1 }}
                  >
                    <Edit size={18} />
                  </button>

                  {ft.ativa && (
                    <button 
                        className="btn-icon btn-delete"
                        onClick={() => handleInativar(ft.id)}
                        disabled={inativarMutation.isPending}
                        title="Inativar Ficha"
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
                Não há fichas técnicas cadastradas no momento. Clique em "Nova Ficha" para iniciar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FichaTecnicaList;