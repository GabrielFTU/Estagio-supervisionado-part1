import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Layers, Plus, Edit, Ban } from 'lucide-react'; 
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

  const deleteMutation = useMutation({
    mutationFn: faseProducaoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasesProducao'] });
      alert("Status da Fase de Produção alterado com sucesso!");
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Erro ao alterar status. A fase pode estar em uso.";
      alert(errorMessage);
    }
  });

  const handleInativar = (id, ativo) => {
    const acao = ativo ? "inativar" : "ativar";
    if (window.confirm(`Tem certeza que deseja ${acao} esta Fase de Produção?`)) {
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

  const basePath = "/settings/cadastros/fases";

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Plus size={18} />
            <span>Nova Fase</span>
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
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} className="filter-icon" />
          <select 
            className="select-standard"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
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
          {filteredFases.length > 0 ? (
            filteredFases.map(fase => (
              <tr key={fase.id} className={!fase.ativo ? 'row-inactive' : ''}>
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
                    className="btn-icon btn-edit"
                    onClick={() => navigate(`${basePath}/editar/${fase.id}`)}
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => handleInativar(fase.id, fase.ativo)}
                    disabled={deleteMutation.isPending}
                    title={fase.ativo ? "Inativar Fase" : "Ativar Fase"}
                  >
                    <Ban size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty-state">
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