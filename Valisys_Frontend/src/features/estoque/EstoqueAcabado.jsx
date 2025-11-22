import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, List, Anchor, MapPin, Calendar } from 'lucide-react';
import estoqueService from '../../services/estoqueService.js';
import '../../features/produto/ProdutoList.css';

function EstoqueAcabado() {
  const [activeTab, setActiveTab] = useState('simples'); 

  const { data: estoqueSimples, isLoading: loadingSimples } = useQuery({
    queryKey: ['estoqueSimples'],
    queryFn: estoqueService.getSimples,
    enabled: activeTab === 'simples'
  });

  const { data: estoqueAnalitico, isLoading: loadingAnalitico } = useQuery({
    queryKey: ['estoqueAnalitico'],
    queryFn: estoqueService.getAnalitico,
    enabled: activeTab === 'analitico'
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Estoque de Produtos Acabados</h1>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('simples')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'simples' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'simples' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Package size={20} /> Visão Simples (Quantidade)
        </button>
        <button 
          onClick={() => setActiveTab('analitico')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'analitico' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'analitico' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <List size={20} /> Visão Analítica (Detalhada)
        </button>
      </div>

      {activeTab === 'simples' && (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Produto</th>
                <th>Un.</th>
                <th style={{textAlign: 'right'}}>Em Estoque</th>
              </tr>
            </thead>
            <tbody>
              {loadingSimples ? (
                 <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Carregando...</td></tr>
              ) : estoqueSimples?.length > 0 ? (
                estoqueSimples.map((item) => (
                  <tr key={item.produtoId}>
                    <td>{item.codigoProduto}</td>
                    <td>{item.produtoNome}</td>
                    <td>{item.unidadeMedida}</td>
                    <td style={{textAlign: 'right', fontWeight: 'bold', fontSize: '1.1em', color: '#16a34a'}}>
                        {item.quantidadeTotal}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="empty-state">Nenhum produto em estoque.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analitico' && (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Chassi (Lote)</th>
                <th>Produto</th>
                <th>Localização</th>
                <th>Data Conclusão</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingAnalitico ? (
                 <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Carregando...</td></tr>
              ) : estoqueAnalitico?.length > 0 ? (
                estoqueAnalitico.map((item) => (
                  <tr key={item.loteId}>
                    <td style={{fontWeight: 'bold', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <Anchor size={16} /> {item.chassi}
                    </td>
                    <td>{item.produtoNome}</td>
                    <td style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <MapPin size={14} color="#666"/> {item.localizacao}
                    </td>
                    <td>
                        <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                            <Calendar size={14} color="#666"/>
                            {new Date(item.dataConclusao).toLocaleDateString()}
                        </span>
                    </td>
                    <td><span className="status-ativo">{item.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="empty-state">Nenhum chassi encontrado em estoque.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EstoqueAcabado;