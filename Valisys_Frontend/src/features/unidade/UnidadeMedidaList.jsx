import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Ruler, Edit, Ban } from 'lucide-react';
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

  const statusMutation = useMutation({
    mutationFn: unidadeMedidaService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidadesMedida'] });
      alert("Status da unidade alterado com sucesso!");
    },
    onError: (err) => alert(`Erro ao alterar status: ${err.response?.data?.message || err.message}`)
  });

  const handleStatusChange = (id, ativo) => {
    const acao = ativo ? "inativar" : "ativar";
    if (window.confirm(`Deseja realmente ${acao} esta unidade de medida?`)) {
      statusMutation.mutate(id);
    }
  };

  const filtered = useMemo(() => {
    if (!unidades) return [];

    const q = searchTerm.toLowerCase();

    return unidades.filter(u => {
      const text = `${u.sigla} ${u.nome}`.toLowerCase();
      const matchesSearch = text.includes(q);
      
      let matchesStatus = true;
      if (filterStatus === 'active') matchesStatus = u.ativo === true;
      if (filterStatus === 'inactive') matchesStatus = u.ativo === false;

      return matchesSearch && matchesStatus;
    });
  }, [unidades, searchTerm, filterStatus]);

  if (isLoading) return <div className="loading-message">Carregando unidades...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  const basePath = "/settings/cadastros/unidades";

  return (
    <div className="page-container">

      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Ruler size={28} className="text-primary" />
          Unidades de Medida
        </h1>
      </div>

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
            <option value="all">Todos os Status</option>
            <option value="active">Apenas Ativas</option>
            <option value="inactive">Apenas Inativas</option>
          </select>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{width: '80px'}}>Sigla</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Fator</th>
            <th>Status</th>
            <th style={{width: '100px'}}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length > 0 ? (
            filtered.map(u => (
              <tr key={u.id} className={!u.ativo ? 'row-inactive' : ''}>
                <td><strong style={{color: 'var(--text-primary)'}}>{u.sigla}</strong></td>
                <td>{u.nome}</td>
                <td>{GRANDEZAS_LABEL[u.grandeza]}</td>
                <td>
                    {u.ehUnidadeBase ? (
                        <span style={{color: '#16a34a', fontWeight: 'bold', fontSize: '0.85rem'}}>PADRÃO (1.0)</span>
                    ) : (
                        u.fatorConversao
                    )}
                </td>
                
                <td>
                  <span className={u.ativo ? 'status-ativo' : 'status-inativo'}>
                    {u.ativo ? 'Ativa' : 'Inativa'}
                  </span>
                </td>

                <td className="acoes-cell">
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => navigate(`${basePath}/editar/${u.id}`)}
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleStatusChange(u.id, u.ativo)}
                    disabled={statusMutation.isPending}
                    title={u.ativo ? "Inativar Unidade" : "Ativar Unidade"}
                  >
                    <Ban size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="empty-state">Nenhuma Unidade encontrada.</td></tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default UnidadeMedidaList;