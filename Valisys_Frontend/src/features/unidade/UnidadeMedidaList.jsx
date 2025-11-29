import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Ruler, Plus } from 'lucide-react';
import unidadeMedidaService from '../../services/unidadeMedidaService.js';
import '../../features/produto/ProdutoList.css'; 
import SharedToolbar from '../../components/SharedToolbar';

const GRANDEZAS_LABEL = {
  0: 'Unidade', 1: 'Massa', 2: 'Comprimento', 3: 'Volume', 4: 'Tempo', 5: 'Área'
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

  const deleteMutation = useMutation({
    mutationFn: unidadeMedidaService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidadesMedida'] });
      alert("Unidade de Medida excluída com sucesso!");
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Erro ao excluir.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta Unidade?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  const filteredUnidades = useMemo(() => {
    if (!unidades) return [];
    const q = (searchTerm || '').toLowerCase();
    return (unidades || []).filter(u => {
      const text = `${u.sigla || ''} ${u.nome || ''}`.toLowerCase();
      const matchesSearch = !q || text.includes(q);
      const matchesStatus = filterStatus === 'all' ? true : (filterStatus === 'active' ? u.ativo : !u.ativo);
      return matchesSearch && matchesStatus;
    });
  }, [unidades, searchTerm, filterStatus]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Ruler size={28} className="text-primary"/> Unidades de Medida
        </h1>
        <Link to="/settings/cadastros/unidades/novo" className="btn-new">
            <Plus size={18} /> Nova Unidade
        </Link>
      </div>

      <SharedToolbar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por sigla ou nome..."
        filterValue={filterStatus}
        onFilterChange={setFilterStatus}
        filterOptions={[{value: 'all', label: 'Todos os status'}, {value: 'active', label: 'Ativo'}, {value: 'inactive', label: 'Inativo'}]}
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>Sigla</th>
            <th>Nome</th>
            <th>Grandeza</th>
            <th>Fator</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUnidades && filteredUnidades.length > 0 ? (
            filteredUnidades.map((unidade) => (
              <tr key={unidade.id}>
                <td style={{fontWeight: 'bold'}}>{unidade.sigla}</td>
                <td>{unidade.nome}</td>
                <td>
                    <span className="badge" style={{backgroundColor: '#e0f2fe', color: '#0369a1'}}>
                        {GRANDEZAS_LABEL[unidade.grandeza] || 'Outro'}
                    </span>
                </td>
                <td>
                    {unidade.ehUnidadeBase ? (
                        <span style={{color: '#16a34a', fontWeight: 'bold'}}>BASE (1.0)</span>
                    ) : (
                        unidade.fatorConversao
                    )}
                </td>
                <td className="acoes-cell">
                  <button className="btn-icon btn-edit" onClick={() => navigate(`/settings/cadastros/unidades/editar/${unidade.id}`)}>
                    <Edit size={18} />
                  </button>
                  <button className="btn-icon btn-delete" onClick={() => handleDelete(unidade.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="empty-state">Nenhuma Unidade de Medida encontrada.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UnidadeMedidaList;