import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  Search, PlayCircle, Package, Calendar, Activity, Hash, 
  CheckCircle, AlertCircle, Info, Layers, Box, X, Loader2, ScanBarcode 
} from 'lucide-react';
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import './ConsultaOP.css'; 

// Mapa para traduzir o ID numérico do backend para Texto
const STATUS_MAP = {
    1: 'Ativa',
    2: 'Aguardando',
    3: 'Finalizada',
    4: 'Cancelada'
};

function ConsultaOP() {
  const [searchCode, setSearchCode] = useState('');
  const [ordemRaw, setOrdem] = useState(null); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef(null);

  useEffect(() => {
    if(inputRef.current) inputRef.current.focus();
  }, []);

  const ordem = useMemo(() => {
      if (!ordemRaw) return null;
      
      const statusNormalizado = STATUS_MAP[ordemRaw.status] || ordemRaw.status;

      return {
          ...ordemRaw,
          status: statusNormalizado
      };
  }, [ordemRaw]);

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
          setError(null);
      } else {
          setError("Nenhuma ordem encontrada com este código.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar. Verifique se o código está correto.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
      setSearchCode('');
      setOrdem(null);
      setError(null);
      if(inputRef.current) inputRef.current.focus();
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
            <ScanBarcode size={32} className="texto-principal" /> 
            Consulta de Chão de Fábrica
        </h1>
        <p className="subtitle">Bipe o código da Ordem de Produção para visualizar detalhes e realizar apontamentos.</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className={`search-bar-wrapper ${error ? 'has-error' : ''}`}>
            <div className="icon-container">
                {loading ? (
                    <Loader2 size={20} className="animate-spin text-primary" />
                ) : (
                    <Search size={20} className="texto" />
                )}
            </div>
            
            <input 
              ref={inputRef}
              type="text" 
              className="search-input-modern"
              placeholder="Código da O.P. (Ex: OP-2025-0001)" 
              value={searchCode}
              onChange={(e) => {
                  setSearchCode(e.target.value);
                  if(error) setError(null);
              }}
              autoComplete="off"
            />

            {searchCode && (
                <button type="button" className="btn-icon-clear" onClick={handleClear} title="Limpar">
                    <X size={18} />
                </button>
            )}
            
            <button type="submit" className="btn-search-modern" disabled={loading || !searchCode.trim()}>
                Buscar
            </button>
        </form>
        
        {error && (
            <div className="error-message-inline">
                <AlertCircle size={16}/> {error}
            </div>
        )}
      </div>

      {ordem && (
        <div className="op-card fade-in">
          <div className="op-header">
            <div className="op-title">
                <h2>
                    <Hash size={24} className="text-primary" /> 
                    {ordem.codigoOrdem}
                </h2>
                <div className="op-meta-badges">
                    {ordem.loteNumero && (
                        <span className="meta-badge"><Layers size={14}/> Lote: {ordem.loteNumero}</span>
                    )}
                    {ordem.roteiroCodigo && (
                         <span className="meta-badge"><Info size={14}/> Roteiro: {ordem.roteiroCodigo}</span>
                    )}
                </div>
            </div>
            
            <span className={`status-badge ${getStatusClass(ordem.status)}`}>
                {ordem.status}
            </span>
          </div>

          <div className="op-body">
            <div className="info-card">
                <label>Produto</label>
                <div className="info-content">
                    <Package size={20} className="icon-muted"/> 
                    <span>{ordem.produtoNome}</span>
                </div>
            </div>

            <div className="info-card">
                <label>Quantidade</label>
                <div className="info-content">
                    <Box size={20} className="icon-muted"/>
                    <strong>{ordem.quantidade}</strong> 
                    <span className="unit">UN</span>
                </div>
            </div>

            <div className={`info-card ${ordem.status === 'Ativa' ? 'active-fase' : ''}`}>
                <label>Fase Atual</label>
                <div className="info-content">
                    <Activity size={20} className={ordem.status === 'Ativa' ? 'text-primary' : 'icon-muted'}/> 
                    <strong>{ordem.faseAtualNome}</strong>
                </div>
            </div>

            <div className="info-card">
                <label>Início</label>
                <div className="info-content">
                    <Calendar size={20} className="icon-muted"/> 
                    {new Date(ordem.dataInicio).toLocaleDateString()}
                </div>
            </div>
          </div>

          <div className="op-footer">
            {ordem.status === 'Ativa' || ordem.status === 'Aguardando' ? (
                <div className="actions-wrapper">
                    <div className="action-hint">
                        <Info size={16} /> Próximas Ações:
                    </div>
                    <div className="action-buttons-grid">
                        <button 
                            onClick={handleAvancar}
                            disabled={avancarFaseMutation.isPending || finalizarMutation.isPending}
                            className="btn-modern btn-primary"
                        >
                            {avancarFaseMutation.isPending ? <Loader2 size={18} className="animate-spin"/> : <PlayCircle size={18}/>}
                            <span>Avançar Fase</span>
                        </button>

                        <button 
                            onClick={handleFinalizar}
                            disabled={finalizarMutation.isPending || avancarFaseMutation.isPending}
                            className="btn-modern btn-success"
                        >
                             {finalizarMutation.isPending ? <Loader2 size={18} className="animate-spin"/> : <CheckCircle size={18}/>}
                            <span>Concluir Produção</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className={`state-banner ${ordem.status === 'Finalizada' ? 'banner-success' : 'banner-neutral'}`}>
                    {ordem.status === 'Finalizada' 
                        ? <><CheckCircle size={20} /> Processo Produtivo Finalizado. Item em Estoque.</>
                        : <><AlertCircle size={20} /> Ordem Cancelada ou Suspensa.</>
                    }
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaOP;