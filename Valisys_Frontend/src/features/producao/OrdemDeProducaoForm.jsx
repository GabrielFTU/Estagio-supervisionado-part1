import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ClipboardList, Package, Hash, Boxes, Activity, 
  MapPin, FileText, Info, Save, X, AlertCircle, Briefcase, Printer, Layers, ArrowLeft
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
    setError,
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
  
  // --- Queries ---
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

  useEffect(() => { 
      if (!isEditing) setValue('loteId', ""); 
  }, [selectedProdutoId, setValue, isEditing]);

  useEffect(() => { 
      if (!isEditing && roteiroAtivo && primeiraFaseRoteiro) {
          setValue('faseAtualId', primeiraFaseRoteiro);
      }
  }, [roteiroAtivo, primeiraFaseRoteiro, setValue, isEditing]);

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
    
    const prodCheck = produtos?.find(p => (p.id || p.Id) === produtoFinalId);
    if (prodCheck && (prodCheck.controlarPorLote || prodCheck.ControlarPorLote) && !data.loteId) {
        setError('loteId', { 
            type: 'manual', 
            message: "Este produto exige um Lote para rastreabilidade." 
        });
        return;
    }
    
    const mappedData = {
        Id: isEditing ? id : undefined,
        Quantidade: data.quantidade,
        Observacoes: data.observacoes || "",
        ProdutoId: produtoFinalId,
        AlmoxarifadoId: data.almoxarifadoId,
        TipoOrdemDeProducaoId: data.tipoOrdemDeProducaoId,
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
    <div className="op-container">
      <div className="op-header">
        <div className="op-header-left">
            <button type="button" onClick={() => navigate(basePath)} className="btn-back" title="Voltar">
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1>
                    {isEditing ? `Editar Ordem de Produção` : 'Nova Ordem de Produção'}
                </h1>
                <span className="subtitle">
                    {isEditing ? 'Gerencie os detalhes e apontamentos desta ordem.' : 'Planeje uma nova ordem de produção.'}
                </span>
            </div>
        </div>
        
        {isEditing && ordem?.codigoOrdem && (
            <div className="barcode-container fade-in">
                <div className="barcode-wrapper">
                    <Barcode 
                        value={ordem.codigoOrdem} 
                        height={30} 
                        width={1.2} 
                        fontSize={12}
                        margin={0}
                        displayValue={true}
                    />
                </div>
                <div className="barcode-actions">
                    <button 
                        type="button" 
                        className="btn-print" 
                        onClick={handlePrint}
                        title="Imprimir Ficha de Acompanhamento"
                    >
                        <Printer size={18} /> Imprimir Ficha
                    </button>
                </div>
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="op-form-content">
        
        <div className="op-grid">
            
            <div className="col-main">
                <div className="op-card">
                    <div className="op-card-header">
                        <Package size={18} /> Identificação do Produto
                    </div>
                    
                    <div className="form-row">
                        <div className="input-group">
                            <label>Código da O.P.</label>
                            <div className="input-wrapper">
                                <Hash size={16} className="field-icon" />
                                <input 
                                    value={isEditing ? ordem?.codigoOrdem : "Gerado Automaticamente"}
                                    disabled
                                    className="custom-input input-readonly"
                                    style={{fontFamily: 'monospace', fontWeight: 600}}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="produtoId">Produto a Produzir <span className="required-mark">*</span></label>
                            <div className="input-wrapper">
                                <Package size={16} className="field-icon" />
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
                                <Boxes size={16} className="field-icon" />
                                <input 
                                    id="quantidade" 
                                    type="number" 
                                    step="1" 
                                    {...register('quantidade', { valueAsNumber: true })} 
                                    className="custom-input font-bold"
                                />
                            </div>
                            {errors.quantidade && <span className="error-msg"><AlertCircle size={14}/> {errors.quantidade.message}</span>}
                        </div>
                    </div>
                </div>

                <div className="op-card">
                    <div className="op-card-header">
                        <Activity size={18} /> Roteiro e Processo
                    </div>

                    {!isEditing && (
                        <div style={{marginBottom: '1rem'}}>
                            {roteiroAtivo ? (
                                <div className="info-box info-blue">
                                    <Info size={20} className="info-icon" />
                                    <div>
                                        <strong>Roteiro Vinculado: {roteiroAtivo.codigo}</strong>
                                        <p>A fase inicial será definida automaticamente conforme o roteiro padrão deste produto.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="input-group">
                                    <label htmlFor="faseAtualId">Fase Inicial (Manual) <span className="required-mark">*</span></label>
                                    <div className={`input-wrapper ${!roteiroAtivo && !watch('faseAtualId') ? 'input-attention' : ''}`}>
                                        <Activity size={16} className="field-icon" />
                                        <select id="faseAtualId" {...register('faseAtualId')} className="custom-select">
                                            <option value="">Selecione a fase inicial...</option>
                                            {fases?.sort((a, b) => a.ordem - b.ordem).map(f => (
                                                <option key={f.id || f.Id} value={f.id || f.Id}>{f.ordem} - {f.nome || f.Nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="helper-warning">
                                        ⚠ Este produto não possui roteiro definido. Selecione a fase inicial manualmente.
                                    </div>
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
                            placeholder="Instruções especiais, detalhes de personalização ou alertas para a fábrica..."
                        />
                    </div>
                </div>
            </div>

            <div className="col-side">
                <div className="op-card">
                    <div className="op-card-header">
                        <Briefcase size={18} /> Classificação
                    </div>
                    
                    <div className="input-group" style={{marginBottom: '1rem'}}>
                        <label htmlFor="tipoOrdemDeProducaoId">Tipo de Ordem <span className="required-mark">*</span></label>
                        <div className="input-wrapper">
                            <FileText size={16} className="field-icon" />
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
                                <Activity size={16} className="field-icon" />
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
                        <MapPin size={18} /> Logística & Rastreio
                    </div>

                    <div className="input-group" style={{marginBottom: '1rem'}}>
                        <label htmlFor="almoxarifadoId">Destino (Estoque) <span className="required-mark">*</span></label>
                        <div className="input-wrapper">
                            <MapPin size={16} className="field-icon" />
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
                            {exigeLote && <span className="required-mark" title="Produto controla lote">*</span>}
                        </label>
                        <div className={`input-wrapper ${errors.loteId ? 'input-error-border' : ''}`}>
                            <Layers size={16} className={`field-icon ${exigeLote ? 'text-warning' : ''}`} />
                            <select 
                                id="loteId" 
                                {...register('loteId')} 
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
                        
                        {exigeLote && !errors.loteId && lotesDisponiveis.length === 0 && selectedProdutoId && (
                             <small className="helper-warning">
                                 <AlertCircle size={12} />
                                 Necessário cadastrar um lote para este produto.
                             </small>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="form-footer">
          <button type="button" onClick={() => navigate(basePath)} className="btn-cancel">
            <X size={18} /> Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={createMutation.isPending || updateMutation.isPending || isSubmitting}>
            {(createMutation.isPending || updateMutation.isPending || isSubmitting) 
                ? 'Processando...' 
                : <><Save size={18} /> Salvar Ordem</>}
          </button>
        </div>

      </form>
    </div>
  );
}

export default OrdemDeProducaoForm;