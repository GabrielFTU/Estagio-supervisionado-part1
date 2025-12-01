import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Download, Search, Filter, Layers, Box, Printer } from 'lucide-react';

import relatorioService from '../../services/relatorioService.js';
import produtoService from '../../services/produtoService.js';
import categoriaProdutoService from '../../services/categoriaProdutoService.js';

import '../../features/produto/ProdutoList.css';

function RelatorioProdutos() {
  const [filtros, setFiltros] = useState({
    apenasAtivos: true,
    categoriaId: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: produtos, isLoading: isLoadingProdutos } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll });
  const { data: categorias } = useQuery({ queryKey: ['categoriasProduto'], queryFn: categoriaProdutoService.getAll });

  const dadosFiltrados = useMemo(() => {
    if (!produtos) return [];

    return produtos.filter(prod => {
      if (filtros.apenasAtivos && !prod.ativo) return false;

      if (filtros.categoriaId && prod.categoriaProdutoId !== filtros.categoriaId) return false;

      return true;
    });
  }, [produtos, filtros]);

  const fetchPdfBlob = async () => {
    return await relatorioService.downloadProdutos(
      filtros.apenasAtivos,
      filtros.categoriaId || null
    );
  };

  const handleSalvarPDF = async () => {
    setIsProcessing(true);
    try {
      const blob = await fetchPdfBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CatalogoProdutos_${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao salvar PDF:", error);
      alert("Erro ao gerar o arquivo.");
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
      alert("Erro ao gerar visualização.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={28} className="text-primary" />
          Catálogo de Produtos
        </h1>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '25px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--color-primary)', fontWeight: 'bold' }}>
            <Filter size={20} />
            <span>Filtros do Catálogo</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{flex: 1, minWidth: '250px'}}>
                <label style={{display: 'flex', gap: '5px', fontSize: '0.9rem'}}><Layers size={14}/> Categoria<span style={{color: 'var(--color-danger)'}}>*</span></label>
                <select 
                    name="categoriaId"
                    value={filtros.categoriaId}
                    onChange={handleChange}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                >
                    <option value="">Todas as Categorias</option>
                    {categorias?.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                </select>
            </div>

            <div className="form-group-checkbox" style={{ display: 'flex', alignItems: 'center', marginTop: '28px', padding: '0 15px', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <input 
                    type="checkbox" 
                    id="apenasAtivos" 
                    name="apenasAtivos"
                    checked={filtros.apenasAtivos} 
                    onChange={handleChange} 
                    style={{width: '18px', height: '18px', marginRight: '10px'}}
                />
                <label htmlFor="apenasAtivos" style={{ fontSize: '0.95rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    Listar apenas produtos <strong>Ativos</strong>
                </label>
            </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <button 
                onClick={handleImprimirPDF}
                disabled={isProcessing}
                className="btn-cancelar"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc' }}
            >
                <Printer size={18} /> {isProcessing ? 'Gerando...' : 'Imprimir'}
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
              {dadosFiltrados.length} produtos encontrados
          </span>
      </div>

      <div className="table-responsive" style={{ border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Un.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingProdutos ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Carregando produtos...</td></tr>
            ) : dadosFiltrados.length > 0 ? (
                dadosFiltrados.map((prod) => (
                <tr key={prod.id}>
                    <td style={{fontWeight: 'bold'}}>{prod.codigo}</td>
                    <td>{prod.nome}</td>
                    <td>{prod.categoriaProdutoNome}</td>
                    <td>{prod.unidadeMedidaSigla}</td>
                    <td>
                        <span className={`badge ${prod.ativo ? 'badge-active' : 'badge-inactive'}`}>
                            {prod.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="empty-state">
                        Nenhum produto encontrado com os filtros selecionados.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RelatorioProdutos;