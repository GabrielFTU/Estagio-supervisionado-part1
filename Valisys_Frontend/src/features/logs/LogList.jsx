import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, Search, Filter, User, RefreshCw, Clock, Activity } from 'lucide-react';
import logService from '../../services/logService.js';
import '../../features/produto/ProdutoList.css'; 

function LogList() {
  const { data: logs, isLoading, isError, refetch } = useQuery({
    queryKey: ['logsSistema'],
    queryFn: logService.getAll,
    refetchInterval: 30000 
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [moduloFilter, setModuloFilter] = useState('');

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter(log => {
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        (log.detalhes && log.detalhes.toLowerCase().includes(searchLower)) ||
        (log.usuarioNome && log.usuarioNome.toLowerCase().includes(searchLower)) ||
        (log.acao && log.acao.toLowerCase().includes(searchLower));

      const matchesModulo = moduloFilter ? log.modulo === moduloFilter : true;

      return matchesSearch && matchesModulo;
    });
  }, [logs, searchTerm, moduloFilter]);

  const modulosUnicos = useMemo(() => {
      if (!logs) return [];
      return [...new Set(logs.map(l => l.modulo))].sort();
  }, [logs]);

  const getActionStyle = (acao) => {
      const a = acao ? acao.toLowerCase() : '';
      if (a.includes('cria') || a.includes('login') || a.includes('sucesso')) 
          return { bg: '#dcfce7', text: '#166534' }; 
      if (a.includes('edi') || a.includes('atuali')) 
          return { bg: '#dbeafe', text: '#1e40af' }; 
      if (a.includes('exclu') || a.includes('remov') || a.includes('cancel')) 
          return { bg: '#fee2e2', text: '#991b1b' }; 
      
      return { bg: '#f3f4f6', text: '#374151' }; 
  };

  if (isLoading) return <div className="loading-message">Carregando logs de auditoria...</div>;
  if (isError) return <div className="error-message">Erro ao carregar logs. Verifique se o backend está rodando.</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={28} className="text-primary" />
          Logs de Atividades e Auditoria
        </h1>
        <button 
            onClick={() => refetch()} 
            className="btn-icon" 
            title="Atualizar Lista"
            style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '8px', cursor: 'pointer', borderRadius: '6px' }}
        >
            <RefreshCw size={20} color="#666" />
        </button>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '25px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            <div style={{ flex: 2, minWidth: '300px', position: 'relative' }}>
                <Search size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af'}} />
                <input 
                    type="text" 
                    placeholder="Buscar por usuário, ação ou detalhe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%', 
                        padding: '10px 10px 10px 40px', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border-color)',
                        fontSize: '0.95rem'
                    }}
                />
            </div>

            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <Filter size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af'}} />
                <select 
                    value={moduloFilter}
                    onChange={(e) => setModuloFilter(e.target.value)}
                    style={{
                        width: '100%', 
                        padding: '10px 10px 10px 40px', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#fff',
                        fontSize: '0.95rem'
                    }}
                >
                    <option value="">Todos os Módulos</option>
                    {modulosUnicos.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
        </div>
      </div>

      <div className="table-responsive" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{width: '180px'}}>Data/Hora</th>
              <th style={{width: '200px'}}>Usuário</th>
              <th style={{width: '150px'}}>Módulo</th>
              <th style={{width: '120px'}}>Ação</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                  const style = getActionStyle(log.acao);
                  return (
                    <tr key={log.id}>
                        <td style={{whiteSpace: 'nowrap', color: '#555', fontSize: '0.9rem'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                <Clock size={14} color="#888"/>
                                {new Date(log.dataHora).toLocaleDateString()} {new Date(log.dataHora).toLocaleTimeString()}
                            </div>
                        </td>
                        <td>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', color: '#333'}}>
                                <User size={16} color="#666" style={{background: '#f3f4f6', padding: '2px', borderRadius: '50%'}}/> 
                                {log.usuarioNome || 'Sistema'}
                            </div>
                        </td>
                        <td>
                            <div style={{display: 'flex', alignItems: 'center', gap: '5px', color: '#4b5563'}}>
                                <Activity size={14} />
                                <span style={{fontWeight: '600', fontSize: '0.85rem'}}>{log.modulo}</span>
                            </div>
                        </td>
                        <td>
                            <span className="badge" style={{backgroundColor: style.bg, color: style.text, border: `1px solid ${style.bg}`}}>
                                {log.acao}
                            </span>
                        </td>
                        <td style={{color: '#374151', fontSize: '0.9rem', lineHeight: '1.4'}}>
                            {log.detalhes}
                        </td>
                    </tr>
                  );
              })
            ) : (
              <tr><td colSpan="5" className="empty-state">Nenhum registro de atividade encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{marginTop: '10px', textAlign: 'right', color: '#666', fontSize: '0.85rem'}}>
          Total de registros: {filteredLogs.length}
      </div>
    </div>
  );
}

export default LogList;