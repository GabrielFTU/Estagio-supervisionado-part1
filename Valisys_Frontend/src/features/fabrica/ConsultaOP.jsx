import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  Search, PlayCircle, Package, Calendar, Activity, Hash, 
  CheckCircle, AlertCircle, Info, Layers, ArrowRight
} from 'lucide-react';
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import '../../features/produto/ProdutoList.css'; 

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
    e.preventDefault();
    if (!searchCode) return;

    setLoading(true);
    setError(null);
    setOrdem(null);

    try {
      const data = await ordemDeProducaoService.getByCodigo(searchCode);
      if(data) {
          setOrdem(data);
      } else {
          setError("Nenhuma ordem encontrada com este código.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar a ordem. Verifique o código.");
    } finally {
      setLoading(false);
    }
  };

  const avancarFaseMutation = useMutation({
    mutationFn: ordemDeProducaoService.avancarFase,
    onSuccess: () => {
      alert("Sucesso: Produção avançada!");
      handleSearch({ preventDefault: () => {} }); 
    },
    onError: (err) => alert(`Erro: ${err.response?.data?.message || err.message}`)
  });

  const finalizarMutation = useMutation({
    mutationFn: ordemDeProducaoService.finalizar,
    onSuccess: () => {
      alert("Produção Finalizada! Estoque gerado.");
      handleSearch({ preventDefault: () => {} }); 
    },
    onError: (err) => alert(`Erro: ${err.response?.data?.message || err.message}`)
  });

  const handleAvancar = () => {
    if (window.confirm(`Confirmar avanço para a próxima etapa?`)) {
      avancarFaseMutation.mutate(ordem.id);
    }
  };

  const handleFinalizar = () => {
    if (window.confirm(`ATENÇÃO: Finalizar esta O.P. irá gerar estoque. Confirmar?`)) {
      finalizarMutation.mutate(ordem.id);
    }
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'Ativa': return { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd' };
          case 'Finalizada': return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
          case 'Cancelada': return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
          default: return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
      }
  };

  return (
    <div className="page-container" style={{maxWidth: '1000px', margin: '0 auto'}}>
      
      <div className="page-header">
        <h1 style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.8rem'}}>
            <Activity size={32} className="text-primary" /> 
            Consulta de Chão de Fábrica
        </h1>
      </div>
      <div className="card" style={{ 
          padding: '30px', 
          marginBottom: '30px', 
          backgroundColor: '#fff', 
          borderRadius: '12px', 
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={24} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Bipe ou digite o código da O.P..." 
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 50px', 
                  borderRadius: '8px', 
                  border: '2px solid #e5e7eb', 
                  fontSize: '1.2rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <button 
            type="submit" 
            className="btn-salvar" 
            disabled={loading} 
            style={{
                padding: '16px 32px', 
                fontSize: '1.1rem', 
                height: '100%', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
          >
            {loading ? '...' : <><Search size={20}/> Buscar</>}
          </button>
        </form>
        
        {error && (
            <div style={{
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#fee2e2', 
                color: '#b91c1c', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                border: '1px solid #fecaca'
            }}>
                <AlertCircle size={24}/> 
                <span style={{fontWeight: '500'}}>{error}</span>
            </div>
        )}
      </div>
      {ordem && (
        <div className="card" style={{ 
            padding: '0', 
            backgroundColor: '#fff', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)', 
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
        }}>
          <div style={{ 
              padding: '25px 30px', 
              borderBottom: '1px solid #f3f4f6', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: '#f9fafb'
          }}>
            <div>
                <h2 style={{ margin: 0, fontSize: '2.2rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Hash size={36} color="var(--color-primary)" /> {ordem.codigoOrdem}
                </h2>
                <div style={{ display: 'flex', gap: '20px', marginTop: '8px', color: '#6b7280', fontSize: '0.95rem' }}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Layers size={16}/> Lote: <strong>{ordem.loteNumero || '-'}</strong></span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Info size={16}/> Roteiro: <strong>{ordem.roteiroCodigo || 'Padrão'}</strong></span>
                </div>
            </div>
            
            {(() => {
                const style = getStatusColor(ordem.status);
                return (
                    <span style={{ 
                        backgroundColor: style.bg, 
                        color: style.text, 
                        border: `1px solid ${style.border}`,
                        padding: '8px 20px', 
                        borderRadius: '9999px', 
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {ordem.status}
                    </span>
                );
            })()}
          </div>

          {/* Corpo do Card (Grid de Informações) */}
          <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
            
            <div>
                <label style={{color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em'}}>Produto</label>
                <div style={{fontWeight: 'bold', fontSize: '1.25rem', color: '#111827', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Package size={20} color="#4b5563"/> {ordem.produtoNome}
                </div>
            </div>

            <div>
                <label style={{color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em'}}>Quantidade</label>
                <div style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#111827', marginTop: '5px'}}>
                    {ordem.quantidade} <span style={{fontSize: '1rem', fontWeight: 'normal', color: '#6b7280'}}>UN</span>
                </div>
            </div>

            <div>
                <label style={{color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em'}}>Fase Atual</label>
                <div style={{fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-primary)', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Activity size={20}/> {ordem.faseAtualNome}
                </div>
            </div>

            <div>
                <label style={{color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em'}}>Início</label>
                <div style={{fontWeight: 'bold', fontSize: '1.25rem', color: '#111827', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Calendar size={20} color="#4b5563"/> {new Date(ordem.dataInicio).toLocaleDateString()}
                </div>
            </div>
          </div>

          {/* Rodapé com Ações */}
          <div style={{ 
              padding: '25px 30px', 
              backgroundColor: '#f9fafb', 
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '15px'
          }}>
            
            {ordem.status !== 'Finalizada' && ordem.status !== 'Cancelada' ? (
                <>
                    <div style={{marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontStyle: 'italic'}}>
                        <Info size={18} />
                        <span>Selecione a ação para a etapa atual:</span>
                    </div>

                    <button 
                        onClick={handleAvancar}
                        disabled={avancarFaseMutation.isPending}
                        className="btn-salvar"
                        style={{ 
                            backgroundColor: '#3b82f6',
                            padding: '12px 24px', 
                            fontSize: '1rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            borderRadius: '8px'
                        }}
                    >
                        {avancarFaseMutation.isPending ? '...' : <><PlayCircle size={20}/> Avançar Fase</>}
                    </button>

                    <button 
                        onClick={handleFinalizar}
                        disabled={finalizarMutation.isPending}
                        style={{ 
                            backgroundColor: '#10b981', 
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px', 
                            fontSize: '1rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                        }}
                    >
                        {finalizarMutation.isPending ? 'Finalizando...' : <><CheckCircle size={20}/> Finalizar Produção</>}
                    </button>
                </>
            ) : (
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: '#059669', fontWeight: '600', fontSize: '1.1rem'}}>
                    <CheckCircle size={24} />
                    <span>Processo Concluído. Produto em Estoque.</span>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaOP;