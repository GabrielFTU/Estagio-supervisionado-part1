import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Ban, Search, X, Filter, Plus } from 'lucide-react';
import almoxarifadoService from '../../services/almoxarifadoService.js';
import '../../features/produto/ProdutoList.css'; 

function useAlmoxarifados() {
  return useQuery({
    queryKey: ['almoxarifados'],
    queryFn: almoxarifadoService.getAll
  });
}

function AlmoxarifadoList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ativo');
  const { data: almoxarifados, isLoading, isError, error } = useAlmoxarifados();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: almoxarifadoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['almoxarifados'] });
      alert("Status do Almoxarifado alterado com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao alterar status.";
      alert(errorMessage);
    }
  });

  const handleInativar = (id) => {
    if (window.confirm("Deseja inativar este almoxarifado? Ele não aparecerá nas seleções de novas OPs.")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredAlmoxarifados = useMemo(() => {
    if (!almoxarifados) return [];

    return almoxarifados.filter(almoxarifado => {
        const q = (searchTerm || '').toLowerCase();
        const matchesSearch = !q || 
            String(almoxarifado.nome).toLowerCase().includes(q) || 
            String(almoxarifado.localizacao || '').toLowerCase().includes(q);
        
        let matchesStatus = true;
        if (statusFilter === 'ativo') matchesStatus = almoxarifado.ativo === true;
        if (statusFilter === 'inativo') matchesStatus = almoxarifado.ativo === false;

        return matchesSearch && matchesStatus;
    });
  }, [almoxarifados, searchTerm, statusFilter]);

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar almoxarifados: {error.message}</div>;

  const basePath = '/settings/cadastros/almoxarifados';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          Gerenciamento de Almoxarifados
        </h1>
        <Link to={`${basePath}/novo`} className="btn-new">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Plus size={18} />
                <span>Novo Almoxarifado</span>
            </div>
        </Link>
      </div>

      <div className="toolbar-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou local..." 
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
            <option value="inativo">Apenas Inativos</option>
          </select>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Localização</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlmoxarifados && filteredAlmoxarifados.length > 0 ? (
            filteredAlmoxarifados.map((almoxarifado) => (
              <tr key={almoxarifado.id} className={!almoxarifado.ativo ? 'row-inactive' : ''}>
                <td>{almoxarifado.nome}</td>
                <td>{almoxarifado.localizacao}</td>
                <td>
                  <span className={almoxarifado.ativo ? 'status-ativo' : 'status-inativo'}>
                    {almoxarifado.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-icon btn-edit" 
                    onClick={() => navigate(`${basePath}/editar/${almoxarifado.id}`)}
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>

                  {almoxarifado.ativo && (
                      <button 
                        className="btn-icon btn-delete" 
                        onClick={() => handleInativar(almoxarifado.id)}
                        disabled={deleteMutation.isPending}
                        title="Inativar Almoxarifado"
                      >
                        <Ban size={18} />
                      </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-state">
                Nenhum almoxarifado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AlmoxarifadoList;