import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Edit, Ban, PlayCircle, CheckCircle, 
  Search, X, Filter, Plus, ClipboardList, Calendar, ArrowRight 
} from 'lucide-react'; 
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import '../../features/produto/ProdutoList.css'; 

function useOrdensDeProducao() {
  return useQuery({
    queryKey: ['ordensDeProducao'],
    queryFn: ordemDeProducaoService.getAll,
    staleTime: 0, 
    refetchOnWindowFocus: true
  });
}

function OrdemDeProducaoList() {
  const { data: ordens, isLoading, isError, error } = useOrdensDeProducao();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ativo');

  const basePath = '/producao/op';

  const invalidateList = () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
  };

  const cancelMutation = useMutation({
    mutationFn: ordemDeProducaoService.delete, 
    onSuccess: () => {
      invalidateList();
      alert("Ordem de Produção cancelada com sucesso!");
    },
    onError: (err) => alert(err.response?.data?.message || "Erro ao cancelar.")
  });

  const avancarFaseMutation = useMutation({
    mutationFn: ordemDeProducaoService.avancarFase,
    onSuccess: () => invalidateList(),
    onError: (err) => alert(err.response?.data?.message || "Erro ao avançar fase.")
  });

  const finalizarMutation = useMutation({
    mutationFn: ordemDeProducaoService.finalizar,
    onSuccess: () => {
      invalidateList();
      alert("Produção finalizada! Estoque gerado.");
    },
    onError: (err) => alert(err.response?.data?.message || "Erro ao finalizar.")
  });

  const handleCancel = (id, codigo) => {
    if (window.confirm(`Tem certeza que deseja CANCELAR a Ordem ${codigo}? \n\nIsso irá liberar o Lote vinculado e encerrar o processo.`)) {
      cancelMutation.mutate(id);
    }
  };
  
  const handleAvancarFase = (id) => {
      if(window.confirm("Confirmar avanço para a próxima fase?")) {
          avancarFaseMutation.mutate(id);
      }
  };

  const handleFinalizarManual = (id) => {
      if(window.confirm("Deseja concluir esta ordem e enviar o produto ao estoque?")) {
          finalizarMutation.mutate(id);
      }
  }
  
  const handleViewReport = (id) => {
    const reportUrl = ordemDeProducaoService.getReportUrl(id);
    window.open(reportUrl, '_blank');
  };

  const getStatusBadge = (statusName) => {
      const styles = {
          'Ativa': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
          'Aguardando': { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
          'Finalizada': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
          'Cancelada': { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
      };

      const style = styles[statusName] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };

      return (
          <span className="badge" style={{
              backgroundColor: style.bg, 
              color: style.color, 
              border: `1px solid ${style.border}`,
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase'
          }}>
              {statusName}
          </span>
      );
  };

  const filteredOrdens = useMemo(() => {
    if (!ordens) return [];
    return ordens.filter(op => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q || 
        String(op.codigoOrdem).toLowerCase().includes(q) || 
        String(op.produtoNome || '').toLowerCase().includes(q);
      
      const statusMap = { 1: 'Ativa', 2: 'Aguardando', 3: 'Finalizada', 4: 'Cancelada' };
      const normalizedStatus = statusMap[op.status] || op.status;

      let matchesStatus = true;
      if (statusFilter === 'ativos') matchesStatus = normalizedStatus === 'Ativa' || normalizedStatus === 'Aguardando';
      if (statusFilter === 'finalizados') matchesStatus = normalizedStatus === 'Finalizada';
      if (statusFilter === 'cancelados') matchesStatus = normalizedStatus === 'Cancelada';

      return matchesSearch && matchesStatus;
    });
  }, [ordens, searchTerm, statusFilter]);

  if (isLoading) return <div className="loading-message">Carregando Ordens de Produção...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{padding: '8px', borderRadius: '8px', display: 'flex'}}>
                <ClipboardList size={24} className="text-primary" />
            </div>
            Gestão de Produção
        </h1>
        <Link to={`${basePath}/novo`} className="btn-new">
            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                <Plus size={18} />
                <span>Nova O.P.</span>
            </div>
        </Link>
      </div>

      <div className="toolbar-container" style={{backgroundColor: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px'}}>
        <div className="search-box" style={{border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)'}}>
            <Search size={18} className="search-icon" />
            <input 
                type="text" 
                placeholder="Pesquisar O.P, produto..." 
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
            <Filter size={18} className="filter-icon" />
            <select 
                className="select-standard"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{backgroundColor: 'var(--bg-primary)', border: 'none'}}
            >
                <option value="all">Todos os Status</option>
                <option value="ativos">Em Andamento</option>
                <option value="finalizados">Finalizadas</option>
                <option value="cancelados">Canceladas</option>
            </select>
        </div>
      </div>

      <div className="table-responsive" style={{boxShadow: '0 2px 5px rgba(0,0,0,0.02)', borderRadius: '8px'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{width: '12%'}}>Código</th>
              <th style={{width: '25%'}}>Produto</th>
              <th style={{width: '8%', textAlign: 'center'}}>Qtd.</th>
              <th style={{width: '20%'}}>Fase / Processo</th>
              <th style={{width: '10%', textAlign: 'center'}}>Status</th>
              <th style={{width: '10%'}}>Início</th>
              <th style={{width: '15%', textAlign: 'right', paddingRight: '20px'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrdens.length > 0 ? (
              filteredOrdens.map((op) => {
                const statusMap = { 1: 'Ativa', 2: 'Aguardando', 3: 'Finalizada', 4: 'Cancelada' };
                const statusStr = statusMap[op.status] || op.status;
                
                const isFinalizada = statusStr === 'Finalizada';
                const isCancelada = statusStr === 'Cancelada';
                const isEditable = !isFinalizada && !isCancelada;

                return (
                  <tr key={op.id} className={!isEditable ? 'row-inactive' : ''}>
                    <td style={{fontWeight: '700', color: 'var(--color-primary)', fontFamily: 'monospace', fontSize: '0.9rem'}}>
                        {op.codigoOrdem}
                    </td>
                    <td>
                        <div style={{fontWeight: '500'}}>{op.produtoNome}</div>
                        {op.loteNumero && <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Lote: {op.loteNumero}</div>}
                    </td>
                    <td style={{fontWeight: 'bold', textAlign: 'center'}}>{op.quantidade}</td>
                    
                    <td>
                        {isFinalizada ? (
                            <div style={{color: '#15803d', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <CheckCircle size={14}/> Produção Concluída
                            </div>
                        ) : isCancelada ? (
                            <div style={{color: '#b91c1c', fontSize: '0.85rem'}}>Processo Interrompido</div>
                        ) : (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span style={{fontWeight: '600', color: 'var(--text-primary)'}}>{op.faseAtualNome}</span>
                                {op.roteiroCodigo && <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Roteiro: {op.roteiroCodigo}</span>}
                            </div>
                        )}
                    </td>

                    <td style={{textAlign: 'center'}}>{getStatusBadge(statusStr)}</td>
                    
                    <td style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                            <Calendar size={14}/>
                            {new Date(op.dataInicio).toLocaleDateString()}
                        </div>
                    </td>
                    
                    <td className="acoes-cell" style={{justifyContent: 'flex-end', paddingRight: '15px'}}>
                      
                      {isEditable && (
                          <>
                            <button 
                                className="icon-action-btn primary"
                                title="Avançar Próxima Fase"
                                onClick={() => handleAvancarFase(op.id)}
                                disabled={avancarFaseMutation.isPending}
                            >
                                <ArrowRight size={16} />
                            </button>

                            <button 
                                className="icon-action-btn success"
                                title="Concluir Produção (Gerar Estoque)"
                                onClick={() => handleFinalizarManual(op.id)}
                                disabled={finalizarMutation.isPending}
                            >
                                <CheckCircle size={16} />
                            </button>
                          </>
                      )}

                      <button 
                        className="icon-action-btn neutral"
                        title="Imprimir Ficha de Produção"
                        onClick={() => handleViewReport(op.id)}
                      >
                        <FileText size={16} />
                      </button>
                      
                      <button 
                        className="icon-action-btn neutral"
                        onClick={() => navigate(`${basePath}/editar/${op.id}`)}
                        disabled={!isEditable}
                        style={{opacity: !isEditable ? 0.5 : 1}}
                        title={isEditable ? "Editar Detalhes" : "Visualizar"}
                      >
                        <Edit size={16} />
                      </button>
                      
                      {isEditable && (
                          <button 
                            className="icon-action-btn danger"
                            onClick={() => handleCancel(op.id, op.codigoOrdem)}
                            disabled={cancelMutation.isPending} 
                            title="Cancelar Ordem (Interromper)"
                          >
                            <Ban size={16} />
                          </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="empty-state" style={{padding: '40px 0'}}>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)'}}>
                      <ClipboardList size={40} style={{opacity: 0.3}} />
                      <span>Nenhuma Ordem de Produção encontrada.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <style>{`
        .icon-action-btn {
            border: none;
            background: transparent;
            padding: 6px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon-action-btn:disabled { cursor: not-allowed; opacity: 0.6; }
        
        .icon-action-btn.primary { color: #2563eb; background-color: #eff6ff; border: 1px solid #bfdbfe; }
        .icon-action-btn.primary:hover { background-color: #dbeafe; }

        .icon-action-btn.success { color: #16a34a; background-color: #f0fdf4; border: 1px solid #bbf7d0; }
        .icon-action-btn.success:hover { background-color: #dcfce7; }

        .icon-action-btn.danger { color: #dc2626; background-color: #fef2f2; border: 1px solid #fecaca; }
        .icon-action-btn.danger:hover { background-color: #fee2e2; }

        .icon-action-btn.neutral { color: #4b5563; border: 1px solid transparent; }
        .icon-action-btn.neutral:hover { background-color: rgba(0,0,0,0.05); color: #1f2937; }
      `}</style>
    </div>
  );
}

export default OrdemDeProducaoList;