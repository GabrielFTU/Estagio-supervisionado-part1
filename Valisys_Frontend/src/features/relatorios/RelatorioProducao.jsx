import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Search, Filter, Calendar, Activity, Printer } from 'lucide-react';

import relatorioService from '../../services/relatorioService.js';
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';

import '../../features/produto/ProdutoList.css'; 

const STATUS_OPTIONS = [
    { value: '', label: 'Todos os Status' },
    { value: 1, label: 'Ativa' },
    { value: 2, label: 'Aguardando' },
    { value: 3, label: 'Finalizada' },
    { value: 4, label: 'Cancelada' }
];
const STATUS_MAP = { 1: 'Ativa', 2: 'Aguardando', 3: 'Finalizada', 4: 'Cancelada' };

function RelatorioProducao() {
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    status: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: ordens, isLoading: isLoadingData } = useQuery({ 
    queryKey: ['ordensDeProducao'], 
    queryFn: ordemDeProducaoService.getAll 
  });

  const dadosFiltrados = useMemo(() => {
    if (!ordens) return [];

    return ordens.filter(op => {
      const dataOp = new Date(op.dataInicio).toISOString().split('T')[0];
      
      if (filtros.dataInicio && dataOp < filtros.dataInicio) return false;
      if (filtros.dataFim && dataOp > filtros.dataFim) return false;
      
      if (filtros.status) {
          const statusTextoEsperado = STATUS_MAP[filtros.status];
          if (op.status !== statusTextoEsperado) return false;
      }

      return true;
    });
  }, [ordens, filtros]);

  // Função auxiliar para obter o PDF do backend
  const fetchPdfBlob = async () => {
    return await relatorioService.downloadProducao(
      filtros.dataInicio || null, 
      filtros.dataFim || null,
      filtros.status || null
    );
  };

  // Botão: Baixar Arquivo
  const handleSalvarPDF = async () => {
    setIsProcessing(true);
    try {
      const blob = await fetchPdfBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RelatorioProducao_${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao salvar PDF:", error);
      alert("Erro ao gerar o arquivo PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Botão: Visualizar no Navegador
  const handleImprimirPDF = async () => {
    setIsProcessing(true);
    try {
      const blob = await fetchPdfBlob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Erro ao abrir impressão:", error);
      alert("Erro ao gerar visualização.");
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
          Relatório de Produção
        </h1>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '25px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--color-primary)', fontWeight: 'bold' }}>
            <Filter size={20} />
            <span>Filtros do Relatório</span>
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
                <label style={{display: 'flex', gap: '5px', fontSize: '0.9rem'}}><Activity size={14}/> Status da O.P.</label>
                <select 
                    name="status"
                    value={filtros.status}
                    onChange={handleChange}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                >
                    {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
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
            >
                <Printer size={18} /> {isProcessing ? 'Gerando...' : 'Imprimir / Visualizar'}
            </button>

            <button 
                onClick={handleSalvarPDF}
                disabled={isProcessing}
                className="btn-salvar"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            >
                <Download size={18} /> {isProcessing ? 'Baixando...' : 'Salvar PDF'}
            </button>
        </div>
      </div>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={20} /> Pré-visualização
          </h3>
          <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              {dadosFiltrados.length} ordens encontradas
          </span>
      </div>

      <div className="table-responsive" style={{ border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingData ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Carregando...</td></tr>
            ) : dadosFiltrados.length > 0 ? (
                dadosFiltrados.map((op) => (
                <tr key={op.id}>
                    <td style={{fontWeight: 'bold'}}>{op.codigoOrdem}</td>
                    <td>{op.produtoNome}</td>
                    <td style={{fontWeight: 'bold'}}>{op.quantidade}</td>
                    <td>{new Date(op.dataInicio).toLocaleDateString()}</td>
                    <td>
                        <span className={`badge ${
                            op.status === 'Ativa' ? 'badge-active' : 
                            op.status === 'Finalizada' ? 'badge-active' : 
                            op.status === 'Cancelada' ? 'badge-inactive' : 'badge-pendente'
                        }`} style={op.status === 'Finalizada' ? {backgroundColor: '#dcfce7', color: '#166534'} : {}}>
                            {op.status}
                        </span>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="empty-state">
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

export default RelatorioProducao;