import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ClipboardList, Package, Hash, Boxes, Activity, 
  MapPin, FileText, Info, Save, X, AlertCircle, Briefcase, Printer, Layers 
} from 'lucide-react';
import Barcode from 'react-barcode'; 

import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import produtoService from '../../services/produtoService.js';
import almoxarifadoService from '../../services/almoxarifadoService.js';
import faseProducaoService from '../../services/faseProducaoService.js';
import tipoOrdemDeProducaoService from '../../services/tipoOrdemDeProducaoService.js';
import loteService from '../../services/loteService.js';
import roteiroProducaoService from '../../services/roteiroProducaoService.js';

import './OrdemDeProducao.css';

const ordemDeProducaoSchema = z.object({
  id: z.string().optional(),
  codigoOrdem: z.string().optional(), 
  quantidade: z.coerce.number().min(1, "A quantidade deve ser maior que zero."),
  observacoes: z.string().max(500).optional(),
  produtoId: z.string().min(1, "Selecione o Produto."),
  almoxarifadoId: z.string().min(1, "Selecione o Almoxarifado."),
  tipoOrdemDeProducaoId: z.string().min(1, "Selecione o Tipo de OP."),
  faseAtualId: z.string().optional(),
  loteId: z.string().nullable().optional(),
  status: z.coerce.number().optional(), 
});

const statusOptions = [
    { value: 1, label: 'Ativa' },
    { value: 2, label: 'Aguardando' },
    { value: 3, label: 'Finalizada' },
    { value: 4, label: 'Cancelada' },
];

function OrdemDeProducaoForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const basePath = '/producao/op';
  
  const { 
    register, 
    handleSubmit, 
    reset,
    watch,
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(ordemDeProducaoSchema),
    defaultValues: { 
        quantidade: 1, 
        status: 1,
        produtoId: "",
        almoxarifadoId: "",
        faseAtualId: "",
        tipoOrdemDeProducaoId: "",
        loteId: ""
    }
  });

  const selectedProdutoId = watch('produtoId');
  
  const { data: produtos } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll });
  const { data: almoxarifados } = useQuery({ queryKey: ['almoxarifados'], queryFn: almoxarifadoService.getAll });
  const { data: fases } = useQuery({ queryKey: ['fasesProducao'], queryFn: faseProducaoService.getAll });
  const { data: tiposOP } = useQuery({ queryKey: ['tiposOrdemDeProducao'], queryFn: tipoOrdemDeProducaoService.getAll });
  const { data: lotes } = useQuery({ queryKey: ['lotes'], queryFn: loteService.getAll });
  const { data: roteiros } = useQuery({ queryKey: ['roteirosProducao'], queryFn: roteiroProducaoService.getAll });
  
  const { data: ordem, isLoading: isLoadingOrdem } = useQuery({
    queryKey: ['ordemDeProducao', id],
    queryFn: () => ordemDeProducaoService.getById(id),
    enabled: isEditing,
  });

  const produtoSelecionadoObj = useMemo(() => {
    if (!produtos || !selectedProdutoId) return null;
    return produtos.find(p => (p.id || p.Id) === selectedProdutoId);
  }, [produtos, selectedProdutoId]);

  const roteiroAtivo = useMemo(() => {
      if (!roteiros || !selectedProdutoId) return null;
      return roteiros.find(r => (r.produtoId === selectedProdutoId || r.ProdutoId === selectedProdutoId) && r.ativo);
  }, [roteiros, selectedProdutoId]);

  const primeiraFaseRoteiro = useMemo(() => {
      if (!roteiroAtivo || !roteiroAtivo.etapas || roteiroAtivo.etapas.length === 0) return null;
      const etapasOrdenadas = [...roteiroAtivo.etapas].sort((a, b) => a.ordem - b.ordem);
      return etapasOrdenadas[0].faseProducaoId;
  }, [roteiroAtivo]);

  const lotesDisponiveis = useMemo(() => {
    if (!lotes || !selectedProdutoId) return [];
    return lotes.filter(l => {
        const mesmoProduto = (l.produtoId === selectedProdutoId || l.ProdutoId === selectedProdutoId);
        const estaAtivo = (l.ativo === true || l.Ativo === true);
        const emUso = l.emUso || l.EmUso;
        const ehLoteDestaOrdem = isEditing && ordem && (l.id === ordem.loteId || l.id === ordem.LoteId);
        return mesmoProduto && estaAtivo && (!emUso || ehLoteDestaOrdem);
    });
  }, [lotes, selectedProdutoId, isEditing, ordem]);

  useEffect(() => { if (!isEditing) setValue('loteId', ""); }, [selectedProdutoId, setValue, isEditing]);
  useEffect(() => { if (!isEditing && roteiroAtivo && primeiraFaseRoteiro) setValue('faseAtualId', primeiraFaseRoteiro); }, [roteiroAtivo, primeiraFaseRoteiro, setValue, isEditing]);

  useEffect(() => {
    if (isEditing && ordem) {
      reset({
        id: ordem.id,
        codigoOrdem: ordem.codigoOrdem,
        quantidade: ordem.quantidade,
        observacoes: ordem.observacoes || "",
        produtoId: ordem.produtoId || ordem.ProdutoId,
        almoxarifadoId: ordem.almoxarifadoId || ordem.AlmoxarifadoId,
        faseAtualId: ordem.faseAtualId || ordem.FaseAtualId,
        tipoOrdemDeProducaoId: ordem.tipoOrdemDeProducaoId || ordem.TipoOrdemDeProducaoId,
        loteId: ordem.loteId || ordem.LoteId || "", 
        status: ordem.status, 
      });
    }
  }, [ordem, isEditing, reset]);

  const createMutation = useMutation({
    mutationFn: ordemDeProducaoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      navigate(basePath);
    },
    onError: (error) => alert(`Falha ao salvar: ${error.response?.data?.message || error.message}`)
  });

  const updateMutation = useMutation({
    mutationFn: (data) => ordemDeProducaoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      navigate(basePath);
    },
    onError: (err) => alert(`Erro ao atualizar: ${err.response?.data?.message || err.message}`)
  });

  const onSubmit = (data) => {
    const produtoFinalId = isEditing ? (ordem.produtoId || ordem.ProdutoId) : data.produtoId;
    const almoxarifadoFinalId = isEditing ? (ordem.almoxarifadoId || ordem.AlmoxarifadoId) : data.almoxarifadoId;
    const tipoOpFinalId = isEditing ? (ordem.tipoOrdemDeProducaoId || ordem.TipoOrdemDeProducaoId) : data.tipoOrdemDeProducaoId;

    const prodCheck = produtos?.find(p => (p.id || p.Id) === produtoFinalId);
    if (prodCheck && (prodCheck.controlarPorLote || prodCheck.ControlarPorLote) && !data.loteId) {
        alert("Este produto exige um Lote. Por favor, selecione um Lote.");
        return;
    }
    
    const mappedData = {
        Id: isEditing ? id : undefined,
        Quantidade: data.quantidade,
        Observacoes: data.observacoes || "",
        ProdutoId: produtoFinalId,
        AlmoxarifadoId: almoxarifadoFinalId,
        TipoOrdemDeProducaoId: tipoOpFinalId,
        FaseAtualId: isEditing ? ordem.faseAtualId : (roteiroAtivo ? null : data.faseAtualId),
        LoteId: data.loteId || null,
        Status: isEditing ? data.status : undefined
    };
    
    if (isEditing) updateMutation.mutate(mappedData);
    else createMutation.mutate(mappedData);
  };

  const handlePrint = () => {
      if (id) {
        const reportUrl = ordemDeProducaoService.getReportUrl(id);
        window.open(reportUrl, '_blank');
      }
  };

  if (isEditing && isLoadingOrdem) return <div className="loading-message">Carregando dados da OP...</div>;

  const exigeLote = produtoSelecionadoObj?.controlarPorLote || produtoSelecionadoObj?.ControlarPorLote;

  return (
<<<<<<< HEAD
    <div className="op-container">
      <div className="op-header">
        <div>
            <h1>
                <ClipboardList size={32} style={{color: '#6366f1'}} />
                {isEditing ? `Editar Ordem de Produção` : 'Nova Ordem de Produção'}
            </h1>
            
            {isEditing && ordem?.codigoOrdem && (
                <div style={{marginTop: '15px', padding: '10px', background: 'var(--bg-secondary)', display: 'inline-flex', alignItems: 'center', gap: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                    <Barcode 
                        value={ordem.codigoOrdem} 
                        height={40} 
                        width={1.5} 
                        fontSize={14}
                        margin={0}
                        displayValue={true}
                    />
                    <div style={{borderLeft: '1px solid var(--border-color)', paddingLeft: '15px', height: '40px', display: 'flex', alignItems: 'center'}}>
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={handlePrint}
                            style={{border: 'none', background: 'var(--bg-tertiary)', color: 'var(--text-primary)'}}
                            title="Imprimir Ficha Física"
                        >
                            <Printer size={18} /> Imprimir
                        </button>
                    </div>
                </div>
            )}
        </div>
        
        {isEditing && <span className="op-badge">{ordem?.codigoOrdem}</span>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="op-grid">
            
            <div className="col-main">
                <div className="op-card">
                    <div className="op-card-header">
                        <Package size={20} /> Identificação do Produto
                    </div>
                    
                    <div className="form-row">
                        <div className="input-group">
                            <label>Código da O.P.</label>
                            <div className="input-wrapper">
                                <Hash size={18} className="field-icon" />
                                <input 
                                    value={isEditing ? ordem?.codigoOrdem : "Gerado Automaticamente (Automático)"}
                                    disabled
                                    className="custom-input input-readonly"
                                />
                            </div>
                            {!isEditing && <small style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginTop:'4px'}}>O sistema irá gerar o código sequencial (ex: OP-2025-0009) ao salvar.</small>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="produtoId">Produto a Produzir <span className="required-mark">*</span></label>
                            <div className="input-wrapper">
                                <Package size={18} className="field-icon" />
                                <select 
                                    id="produtoId" 
                                    {...register('produtoId')} 
                                    disabled={isEditing}
                                    className="custom-select"
                                >
                                    <option value="">Selecione um produto...</option>
                                    {produtos?.filter(p => p.ativo).map(p => (
                                    <option key={p.id || p.Id} value={p.id || p.Id}>
                                        {p.nome || p.Nome} ({p.codigo || p.Codigo || p.CodigoInternoProduto})
                                    </option>
                                    ))}
                                </select>
                            </div>
                            {errors.produtoId && !isEditing && <span className="error-msg"><AlertCircle size={14}/> {errors.produtoId.message}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="quantidade">Quantidade Planejada <span className="required-mark">*</span></label>
                            <div className="input-wrapper">
                                <Boxes size={18} className="field-icon" />
                                <input 
                                    id="quantidade" 
                                    type="number" 
                                    step="1" 
                                    {...register('quantidade', { valueAsNumber: true })} 
                                    className="custom-input"
                                />
                            </div>
                            {errors.quantidade && <span className="error-msg"><AlertCircle size={14}/> {errors.quantidade.message}</span>}
                        </div>
                    </div>
                </div>

                <div className="op-card">
                    <div className="op-card-header">
                        <Activity size={20} /> Processo Produtivo
                    </div>

                    {!isEditing && (
                        <div style={{marginBottom: '1rem'}}>
                            {roteiroAtivo ? (
                                <div className="info-box">
                                    <Info size={24} style={{flexShrink: 0}} />
                                    <div>
                                        <strong>Roteiro Padrão: {roteiroAtivo.codigo}</strong>
                                        <p style={{margin: '4px 0 0 0', fontSize: '0.85rem', color: '#1e3a8a'}}>
                                            Fase Inicial Automática: <b>{fases?.find(f => f.id === primeiraFaseRoteiro)?.nome || 'Carregando...'}</b>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="input-group">
                                    <label htmlFor="faseAtualId">Fase Inicial (Manual)</label>
                                    <div className="input-wrapper">
                                        <Activity size={18} className="field-icon" />
                                        <select id="faseAtualId" {...register('faseAtualId')} className="custom-select">
                                            <option value="">Selecione a fase inicial...</option>
                                            {fases?.sort((a, b) => a.ordem - b.ordem).map(f => (
                                                <option key={f.id || f.Id} value={f.id || f.Id}>{f.ordem} - {f.nome || f.Nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <small style={{color: '#d97706', marginTop: '4px'}}>⚠ Produto sem roteiro. Defina a fase manualmente.</small>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="observacoes">Observações de Produção</label>
                        <textarea 
                            id="observacoes" 
                            {...register('observacoes')} 
                            rows="3" 
                            className="custom-textarea"
                            placeholder="Instruções especiais..."
                        />
                    </div>
                </div>
            </div>

            <div className="col-side">
                <div className="op-card">
                    <div className="op-card-header">
                        <Briefcase size={20} /> Classificação
                    </div>
                    
                    <div className="input-group" style={{marginBottom: '1rem'}}>
                        <label htmlFor="tipoOrdemDeProducaoId">Tipo de Ordem <span className="required-mark">*</span></label>
                        <div className="input-wrapper">
                            <FileText size={18} className="field-icon" />
                            <select 
                                id="tipoOrdemDeProducaoId" 
                                {...register('tipoOrdemDeProducaoId')} 
                                disabled={isEditing}
                                className="custom-select"
                            >
                                <option value="">Selecione...</option>
                                {tiposOP?.map(t => (
                                <option key={t.id || t.Id} value={t.id || t.Id}>{t.nome || t.Nome}</option>
                                ))}
                            </select>
                        </div>
                        {errors.tipoOrdemDeProducaoId && !isEditing && <span className="error-msg"><AlertCircle size={14}/> {errors.tipoOrdemDeProducaoId.message}</span>}
                    </div>

                    {isEditing && (
                        <div className="input-group">
                            <label htmlFor="status">Status Atual</label>
                            <div className="input-wrapper">
                                <Activity size={18} className="field-icon" />
                                <select id="status" {...register('status', { valueAsNumber: true })} className="custom-select">
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="op-card">
                    <div className="op-card-header">
                        <MapPin size={20} /> Logística
                    </div>

                    <div className="input-group" style={{marginBottom: '1rem'}}>
                        <label htmlFor="almoxarifadoId">Destino (Estoque) <span className="required-mark">*</span></label>
                        <div className="input-wrapper">
                            <MapPin size={18} className="field-icon" />
                            <select 
                                id="almoxarifadoId" 
                                {...register('almoxarifadoId')} 
                                disabled={isEditing}
                                className="custom-select"
                            >
                                <option value="">Selecione...</option>
                                {almoxarifados?.map(a => (
                                <option key={a.id || a.Id} value={a.id || a.Id}>{a.nome || a.Nome}</option>
                                ))}
                            </select>
                        </div>
                        {errors.almoxarifadoId && !isEditing && <span className="error-msg"><AlertCircle size={14}/> {errors.almoxarifadoId.message}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="loteId">
                            Lote Destino 
                            {exigeLote && <span style={{color: '#d97706', marginLeft: '4px'}}>*</span>}
                        </label>
                        <div className="input-wrapper">
                            <Layers size={18} className="field-icon" />
                            <select 
                                id="loteId" 
                                {...register('loteId')} 
                                style={exigeLote ? {borderColor: '#fcd34d'} : {}}
                                disabled={!selectedProdutoId || lotesDisponiveis.length === 0}
                                className="custom-select"
                            >
                                <option value="">
                                    {lotesDisponiveis.length === 0 && selectedProdutoId 
                                        ? "Sem lotes disponíveis" 
                                        : "Selecione um lote..."}
                                </option>
                                {lotesDisponiveis.map(l => (
                                <option key={l.id || l.Id} value={l.id || l.Id}>
                                    {l.numeroLote || l.NumeroLote} {l.descricao ? `- ${l.descricao}` : ''}
                                </option>
                                ))}
                            </select>
                        </div>
                        {errors.loteId && <span className="error-msg"><AlertCircle size={14}/> {errors.loteId.message}</span>}
                    </div>
                </div>
            </div>
        </div>

        <div className="form-footer">
          <button type="button" onClick={() => navigate(basePath)} className="btn-cancel">
            <X size={18} /> Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {(createMutation.isPending || updateMutation.isPending) ? 'Processando...' : <><Save size={18} /> Salvar Ordem</>}
=======
    <div className="form-container">
      <h1>Nova ordem de produção</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        <div className="form-group">
          <label htmlFor="nome">Nome<span style={{color: 'var(--color-danger)'}}>*</span></label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição<span style={{color: 'var(--color-danger)'}}>*</span></label>
          <input id="descricao" {...register('descricao')} />
          {errors.descricao && <span className="error">{errors.descricao.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="categoriaProdutoId">Categoria<span style={{color: 'var(--color-danger)'}}>*</span></label>
          <select id="categoriaProdutoId" {...register('categoriaProdutoId')}>
            <option value="" disabled>Selecione<span style={{color: 'var(--color-danger)'}}>*</span></option>
            {categorias?.map(c => (
                <option key={c.id || c.Id} value={c.id || c.Id}>{c.nome || c.Nome}</option>
            ))}
          </select>
          {errors.categoriaProdutoId && <span className="error">{errors.categoriaProdutoId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="unidadeMedidaId">Unidade<span style={{color: 'var(--color-danger)'}}>*</span></label>
          <select id="unidadeMedidaId" {...register('unidadeMedidaId')}>
            <option value="" disabled>Selecione</option>
            {unidades?.map(u => (
                <option key={u.id || u.Id} value={u.id || u.Id}>{u.nome || u.Nome} ({u.sigla || u.Sigla})</option>
            ))}
          </select>
          {errors.unidadeMedidaId && <span className="error">{errors.unidadeMedidaId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="classificacao">Classificação</label>
          <select id="classificacao" {...register('classificacao')}>
            {CLASSIFICACAO_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.classificacao && <span className="error">{errors.classificacao.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="estoqueMinimo">Estoque Mínimo</label>
          <input id="estoqueMinimo" type="number" step="0.01" {...register('estoqueMinimo')} />
          {errors.estoqueMinimo && <span className="error">{errors.estoqueMinimo.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea id="observacoes" {...register('observacoes')} rows="3" />
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="controlarPorLote" {...register('controlarPorLote')} />
          <label htmlFor="controlarPorLote">Controlar por Lote?</label>
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Produto Ativo?</label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/estoque/produtos')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={isSubmitting || updateMutation.isPending}>
            {updateMutation.isPending ? 'Salvando...' : 'Salvar Ordem de Produção'}
>>>>>>> refs/remotes/origin/main
          </button>
        </div>

      </form>
    </div>
  );
}

export default OrdemDeProducaoForm;