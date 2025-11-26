import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Info } from 'lucide-react';

import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import produtoService from '../../services/produtoService.js';
import almoxarifadoService from '../../services/almoxarifadoService.js';
import faseProducaoService from '../../services/faseProducaoService.js';
import tipoOrdemDeProducaoService from '../../services/tipoOrdemDeProducaoService.js';
import loteService from '../../services/loteService.js';
import roteiroProducaoService from '../../services/roteiroProducaoService.js';

import '../../features/produto/ProdutoForm.css'; 

const ordemDeProducaoSchema = z.object({
  id: z.string().optional(),
  codigoOrdem: z.string().min(1, "O código é obrigatório.").max(50),
  quantidade: z.coerce.number().min(1, "A quantidade deve ser maior que zero."),
  observacoes: z.string().max(500).optional(),
  
  produtoId: z.string().optional(), 
  almoxarifadoId: z.string().optional(),
  tipoOrdemDeProducaoId: z.string().optional(),
  
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
    formState: { errors } 
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
  }, [lotes, selectedProdutoId, isEditing, ordem])

  useEffect(() => {
      if (!isEditing) {
          setValue('loteId', ""); 
      }
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
    onError: (error) => {
      console.error("Erro:", error);
      alert(`Falha ao salvar: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => ordemDeProducaoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      navigate(basePath);
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const produtoFinalId = isEditing ? (ordem.produtoId || ordem.ProdutoId) : data.produtoId;
    const almoxarifadoFinalId = isEditing ? (ordem.almoxarifadoId || ordem.AlmoxarifadoId) : data.almoxarifadoId;
    const tipoOpFinalId = isEditing ? (ordem.tipoOrdemDeProducaoId || ordem.TipoOrdemDeProducaoId) : data.tipoOrdemDeProducaoId;

    if (!produtoFinalId) { alert("Selecione um Produto."); return; }
    if (!almoxarifadoFinalId) { alert("Selecione um Almoxarifado."); return; }
    if (!tipoOpFinalId) { alert("Selecione um Tipo de OP."); return; }

    const prodCheck = produtos?.find(p => (p.id || p.Id) === produtoFinalId);
    if (prodCheck && (prodCheck.controlarPorLote || prodCheck.ControlarPorLote) && !data.loteId) {
        alert("Este produto exige um Lote. Por favor, selecione um Lote.");
        return;
    }
    if (!isEditing && !roteiroAtivo && !data.faseAtualId) {
        alert("Este produto não possui Roteiro. Selecione a Fase Inicial.");
        return;
    }

    const mappedData = {
        Id: isEditing ? id : undefined,
        CodigoOrdem: data.codigoOrdem,
        Quantidade: data.quantidade,
        Observacoes: data.observacoes || "",
        ProdutoId: produtoFinalId,
        AlmoxarifadoId: almoxarifadoFinalId,
        TipoOrdemDeProducaoId: tipoOpFinalId,
        FaseAtualId: isEditing ? (ordem.faseAtualId || ordem.FaseAtualId) : (roteiroAtivo ? null : data.faseAtualId),
        LoteId: data.loteId || null,
    };
    
    if (isEditing) {
        mappedData.Status = data.status; 
        updateMutation.mutate(mappedData);
    } else {
        createMutation.mutate(mappedData);
    }
  };

  if (isEditing && isLoadingOrdem) return <div className="loading-message">Carregando OP...</div>;

  const exigeLote = produtoSelecionadoObj?.controlarPorLote || produtoSelecionadoObj?.ControlarPorLote;

  return (
    <div className="form-container">
      <h1>{isEditing ? `Editar OP: ${ordem?.codigoOrdem}` : 'Criar Nova Ordem de Produção'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="codigoOrdem">Código da OP</label>
          <input id="codigoOrdem" {...register('codigoOrdem')} placeholder="Ex: OP-2024-001" />
          {errors.codigoOrdem && <span className="error">{errors.codigoOrdem.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="produtoId">Produto</label>
          <select id="produtoId" {...register('produtoId')} disabled={isEditing}>
            <option value="">Selecione um produto</option>
            {produtos?.map(p => (
              <option key={p.id || p.Id} value={p.id || p.Id}>
                {p.nome || p.Nome} ({p.codigo || p.Codigo || p.CodigoInternoProduto})
              </option>
            ))}
          </select>
          {errors.produtoId && !isEditing && <span className="error">{errors.produtoId.message}</span>}
          {isEditing && <small style={{color: '#666'}}>O produto não pode ser alterado após a criação.</small>}
          
          {exigeLote && (
              <small style={{color: '#eab308', marginTop: '4px', display: 'block'}}>⚠ Este produto requer seleção de Lote.</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="quantidade">Quantidade</label>
          <input id="quantidade" type="number" step="1" {...register('quantidade', { valueAsNumber: true })} />
          {errors.quantidade && <span className="error">{errors.quantidade.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="loteId">Lote {exigeLote ? '*' : '(Opcional)'}</label>
          <select 
            id="loteId" 
            {...register('loteId')} 
            style={{ borderColor: exigeLote ? '#eab308' : '' }}
            disabled={!selectedProdutoId || lotesDisponiveis.length === 0}
          >
            <option value="">
                {lotesDisponiveis.length === 0 && selectedProdutoId 
                    ? "Nenhum lote disponível" 
                    : "Selecione um lote"}
            </option>
            {lotesDisponiveis.map(l => (
              <option key={l.id || l.Id} value={l.id || l.Id}>
                {l.numeroLote || l.NumeroLote} {l.descricao ? `- ${l.descricao}` : ''}
              </option>
            ))}
          </select>
          {errors.loteId && <span className="error">{errors.loteId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tipoOrdemDeProducaoId">Tipo de OP</label>
          <select id="tipoOrdemDeProducaoId" {...register('tipoOrdemDeProducaoId')} disabled={isEditing}>
            <option value="">Selecione o tipo</option>
            {tiposOP?.map(t => (
              <option key={t.id || t.Id} value={t.id || t.Id}>{t.nome || t.Nome}</option>
            ))}
          </select>
          {errors.tipoOrdemDeProducaoId && !isEditing && <span className="error">{errors.tipoOrdemDeProducaoId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="almoxarifadoId">Almoxarifado de Destino</label>
          <select id="almoxarifadoId" {...register('almoxarifadoId')} disabled={isEditing}>
            <option value="">Selecione o almoxarifado</option>
            {almoxarifados?.map(a => (
              <option key={a.id || a.Id} value={a.id || a.Id}>{a.nome || a.Nome}</option>
            ))}
          </select>
          {errors.almoxarifadoId && !isEditing && <span className="error">{errors.almoxarifadoId.message}</span>}
        </div>
        
        {!isEditing && (
            <div className="form-group">
            <label htmlFor="faseAtualId">Fase Inicial</label>
            {roteiroAtivo ? (
                <div style={{padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                    <Info size={24} color="#2563eb" style={{marginTop: '2px'}} />
                    <div>
                        <strong style={{color: '#1e40af', display: 'block', marginBottom: '4px'}}>Roteiro Vinculado: {roteiroAtivo.codigo}</strong>
                        <span style={{fontSize: '0.9rem', color: '#3b82f6', lineHeight: '1.4'}}>
                            A fase inicial será definida automaticamente conforme o roteiro.
                            <br/>
                            Primeira etapa: <strong>{fases?.find(f => f.id === primeiraFaseRoteiro)?.nome || 'Carregando...'}</strong>
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    <select id="faseAtualId" {...register('faseAtualId')}>
                        <option value="">Selecione a fase</option>
                        {fases?.sort((a, b) => a.ordem - b.ordem).map(f => (
                        <option key={f.id || f.Id} value={f.id || f.Id}>{f.ordem} - {f.nome || f.Nome}</option>
                        ))}
                    </select>
                    <small style={{color: '#666'}}>Selecione manualmente (Produto sem Roteiro).</small>
                </>
            )}
            </div>
        )}

        {isEditing && (
            <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" {...register('status', { valueAsNumber: true })}>
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        )}

        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea id="observacoes" {...register('observacoes')} rows="3" />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate(basePath)} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={createMutation.isPending || updateMutation.isPending}>
            {(createMutation.isPending || updateMutation.isPending) ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default OrdemDeProducaoForm;