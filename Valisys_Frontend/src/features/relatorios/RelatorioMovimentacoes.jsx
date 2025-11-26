import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Search, Filter, Calendar, Box, MapPin, Printer } from 'lucide-react';

import relatorioService from '../../services/relatorioService.js';
import movimentacaoService from '../../services/movimentacaoService.js';
import produtoService from '../../services/produtoService.js';
import almoxarifadoService from '../../services/almoxarifadoService.js';

import '../../features/produto/ProdutoList.css';

function RelatorioMovimentacoes() {
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    produtoId: '',
    almoxarifadoId: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: produtos } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll });
  const { data: almoxarifados } = useQuery({ queryKey: ['almoxarifados'], queryFn: almoxarifadoService.getAll });
  
  const { data: todasMovimentacoes, isLoading: isLoadingData } = useQuery({ 
    queryKey: ['movimentacoes'], 
    queryFn: movimentacaoService.getAll 
  });

  const dadosFiltrados = useMemo(() => {
    if (!todasMovimentacoes) return [];

    return todasMovimentacoes.filter(mov => {
      const dataMov = new Date(mov.dataMovimentacao).toISOString().split('T')[0];
      
      if (filtros.dataInicio && dataMov < filtros.dataInicio) return false;
      if (filtros.dataFim && dataMov > filtros.dataFim) return false;
      
      if (filtros.produtoId) {
          if (mov.produtoId && mov.produtoId !== filtros.produtoId) return false;
          else if (!mov.produtoId && mov.produtoNome !== produtos?.find(p => p.id === filtros.produtoId)?.nome) return false;
      }
      
      if (filtros.almoxarifadoId) {
          const nomeAlmox = almoxarifados?.find(a => a.id === filtros.almoxarifadoId)?.nome;
          if (mov.almoxarifadoOrigemNome !== nomeAlmox && mov.almoxarifadoDestinoNome !== nomeAlmox) return false;
      }

      return true;
    });
  }, [todasMovimentacoes, filtros, produtos, almoxarifados]);

  const fetchPdfBlob = async () => {
    return await relatorioService.downloadMovimentacoes(
      filtros.dataInicio || null, 
      filtros.dataFim || null,
      filtros.produtoId || null,
      filtros.almoxarifadoId || null
    );
  };

  const handleSalvarPDF = async () => {
    setIsProcessing(true);
    try {
      const blob = await fetchPdfBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Movimentacoes_${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao salvar PDF:", error);
      alert("Erro ao gerar o arquivo para download.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImprimirPDF = async () => {
    setIsProcessing(true);
    try {
      const blob = await fetchPdfBlob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Erro ao abrir impressão:", error);
      alert("Erro ao gerar a visualização de impressão.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={28} className="text-primary" />
          Relatório de Movimentações
        </h1>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '25px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--color-primary)', fontWeight: 'bold' }}>
            <Filter size={20} />
            <span>Filtros de Pesquisa</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
                <label style={{display: 'flex', gap: '5px', fontSize: '0.9rem'}}><Calendar size={14}/> Data Início</label>
                <input 
                    type="date" 
                    name="dataInicio"
                    value={filtros.dataInicio}
                    onChange={handleChange}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                />
            </div>
            <div className="form-group">
                <label style={{display: 'flex', gap: '5px', fontSize: '0.9rem'}}><Calendar size={14}/> Data Fim</label>
                <input 
                    type="date" 
                    name="dataFim"
                    value={filtros.dataFim}
                    onChange={handleChange}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                />
            </div>

            <div className="form-group">
                <label style={{display: 'flex', gap: '5px', fontSize: '0.9rem'}}><Box size={14}/> Produto</label>
                <select 
                    name="produtoId"
                    value={filtros.produtoId}
                    onChange={handleChange}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                >
                    <option value="">Todos os Produtos</option>
                    {produtos?.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} ({p.codigo})</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label style={{display: 'flex', gap: '5px', fontSize: '0.9rem'}}><MapPin size={14}/> Almoxarifado</label>
                <select 
                    name="almoxarifadoId"
                    value={filtros.almoxarifadoId}
                    onChange={handleChange}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                >
                    <option value="">Todos os Locais</option>
                    {almoxarifados?.map(a => (
                        <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                </select>
            </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <button 
                onClick={handleImprimirPDF}
                disabled={isProcessing}
                className="btn-cancelar" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc' }}
                title="Abre o PDF em nova aba para impressão"
            >
                <Printer size={18} /> {isProcessing ? 'Gerando...' : 'Imprimir'}
            </button>
            <button 
                onClick={handleSalvarPDF}
                disabled={isProcessing}
                className="btn-salvar"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                title="Baixa o arquivo PDF para seu computador"
            >
                <Download size={18} /> {isProcessing ? 'Baixando...' : 'Salvar PDF'}
            </button>
        </div>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={20} /> Pré-visualização dos Dados
          </h3>
          <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              {dadosFiltrados.length} registros encontrados
          </span>
      </div>

      <div className="table-responsive" style={{ border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Usuário</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingData ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Carregando dados...</td></tr>
            ) : dadosFiltrados.length > 0 ? (
                dadosFiltrados.map((mov) => (
                <tr key={mov.id}>
                    <td>{new Date(mov.dataMovimentacao).toLocaleDateString()} {new Date(mov.dataMovimentacao).toLocaleTimeString().slice(0,5)}</td>
                    <td>{mov.produtoNome}</td>
                    <td style={{fontWeight: 'bold'}}>{mov.quantidade}</td>
                    <td>{mov.almoxarifadoOrigemNome}</td>
                    <td>{mov.almoxarifadoDestinoNome}</td>
                    <td style={{color: '#666', fontSize: '0.9em'}}>{mov.usuarioNome}</td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="6" className="empty-state">
                        Nenhum registro encontrado com os filtros selecionados.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RelatorioMovimentacoes;