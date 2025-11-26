import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  Search, PlayCircle, Package, Calendar, Activity, Hash, 
  CheckCircle, AlertCircle, Info, Layers, Box 
} from 'lucide-react';
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import './ConsultaOP.css'; 

function ConsultaOP() {
  const [searchCode, setSearchCode] = useState('');
  const [ordem, setOrdem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef(null);

  useEffect(() => {
    if(inputRef.current) inputRef.current.focus();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault(); 
    if (!searchCode.trim()) return;

    setLoading(true);
    setError(null);
    setOrdem(null);

    try {
      const codigoLimpo = decodeURIComponent(searchCode.trim());
      const data = await ordemDeProducaoService.getByCodigo(codigoLimpo);
      
      if(data) {
          setOrdem(data);
      } else {
          setError("Nenhuma ordem encontrada com este código.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar a ordem. Verifique se o código está correto.");
    } finally {
      setLoading(false);
    }
  };

  const avancarFaseMutation = useMutation({
    mutationFn: ordemDeProducaoService.avancarFase,
    onSuccess: () => {
      handleSearch(); 
    },
    onError: (err) => alert(`Falha ao avançar: ${err.response?.data?.message || err.message}`)
  });

  const finalizarMutation = useMutation({
    mutationFn: ordemDeProducaoService.finalizar,
    onSuccess: () => {
      handleSearch(); 
    },
    onError: (err) => alert(`Falha ao finalizar: ${err.response?.data?.message || err.message}`)
  });

  const handleAvancar = () => {
    if (window.confirm(`Confirmar avanço para a próxima etapa de produção?`)) {
      avancarFaseMutation.mutate(ordem.id);
    }
  };

  const handleFinalizar = () => {
    if (window.confirm(`ATENÇÃO: Finalizar esta O.P. irá gerar a entrada no estoque. Confirmar?`)) {
      finalizarMutation.mutate(ordem.id);
    }
  };

  const getStatusClass = (status) => {
      switch(status) {
          case 'Ativa': return 'status-ativa';
          case 'Finalizada': return 'status-finalizada';
          case 'Cancelada': return 'status-cancelada';
          case 'Aguardando': return 'status-aguardando';
          default: return '';
      }
  };

  return (
    <div className="consulta-container">
      
      <div className="consulta-header">
        <h1>
            <Activity size={32} className="text-primary" /> 
            Consulta de Chão de Fábrica
        </h1>
      </div>

      <div className="search-box">
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-wrapper">
            <Search size={20} className="search-icon" />
            <input 
              ref={inputRef}
              type="text" 
              className="search-input"
              placeholder="Bipe ou digite o código da O.P..." 
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
        
        {error && (
            <div className="error-box">
                <AlertCircle size={20}/> 
                <span>{error}</span>
            </div>
        )}
      </div>

      {ordem && (
        <div className="op-card">
          <div className="op-header">
            <div className="op-title">
                <h2>
                    <Hash size={28} style={{color: '#2563eb'}} /> {ordem.codigoOrdem}
                </h2>
                <div className="op-meta">
                    <span className="meta-item"><Layers size={16}/> Lote: <strong>{ordem.loteNumero || 'N/A'}</strong></span>
                    <span className="meta-item"><Info size={16}/> Roteiro: <strong>{ordem.roteiroCodigo || 'Padrão'}</strong></span>
                </div>
            </div>
            
            <span className={`status-badge ${getStatusClass(ordem.status)}`}>
                {ordem.status}
            </span>
          </div>

          <div className="op-body">
            <div className="info-group">
                <label>Produto</label>
                <div className="info-value">
                    <Package size={18} className="text-gray-500"/> {ordem.produtoNome}
                </div>
            </div>

            <div className="info-group">
                <label>Quantidade</label>
                <div className="info-value">
                    <Box size={18} className="text-gray-500"/>
                    {ordem.quantidade} <span style={{fontWeight: 'normal', fontSize: '0.85rem', color: '#64748b'}}>UN</span>
                </div>
            </div>

            <div className="info-group">
                <label>Fase Atual</label>
                <div className="info-value highlight">
                    <Activity size={18}/> {ordem.faseAtualNome}
                </div>
            </div>

            <div className="info-group">
                <label>Data Início</label>
                <div className="info-value">
                    <Calendar size={18} className="text-gray-500"/> 
                    {new Date(ordem.dataInicio).toLocaleDateString()}
                </div>
            </div>
          </div>

          <div className="op-footer">
            
            {ordem.status === 'Ativa' || ordem.status === 'Aguardando' ? (
                <>
                    <div className="action-hint">
                        <Info size={16} />
                        <span>Ações disponíveis para esta etapa:</span>
                    </div>

                    <div className="action-buttons">
                        <button 
                            onClick={handleAvancar}
                            disabled={avancarFaseMutation.isPending || finalizarMutation.isPending}
                            className="btn-action btn-avancar"
                        >
                            {avancarFaseMutation.isPending ? 'Processando...' : <><PlayCircle size={18}/> Avançar Fase</>}
                        </button>

                        <button 
                            onClick={handleFinalizar}
                            disabled={finalizarMutation.isPending || avancarFaseMutation.isPending}
                            className="btn-action btn-finalizar"
                        >
                            {finalizarMutation.isPending ? 'Finalizando...' : <><CheckCircle size={18}/> Finalizar Produção</>}
                        </button>
                    </div>
                </>
            ) : (
                <div className="success-state">
                    <CheckCircle size={24} />
                    <span>
                        {ordem.status === 'Finalizada' 
                            ? 'Processo Concluído. Produto em Estoque.' 
                            : 'Ordem Cancelada. Nenhuma ação disponível.'}
                    </span>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaOP;