import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import produtoService from '../../services/produtoService.js';
import almoxarifadoService from '../../services/almoxarifadoService.js';
import faseProducaoService from '../../services/faseProducaoService.js';
import tipoOrdemDeProducaoService from '../../services/tipoOrdemDeProducaoService.js';

import '../../features/produto/ProdutoForm.css'; 

const ordemDeProducaoSchema = z.object({
  id: z.string().optional(),
  codigoOrdem: z.string().min(1, "O código é obrigatório.").max(50),
  quantidade: z.coerce.number().min(1, "A quantidade deve ser maior que zero."),
  observacoes: z.string().max(500).optional(),
  
  produtoId: z.string().uuid("Selecione um Produto."),
  almoxarifadoId: z.string().uuid("Selecione um Almoxarifado."),
  faseAtualId: z.string().uuid("Selecione uma Fase Inicial."),
  tipoOrdemDeProducaoId: z.string().uuid("Selecione o Tipo de OP."),
  loteId: z.string().uuid("Selecione um Lote.").optional().nullable(),
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
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(ordemDeProducaoSchema),
    defaultValues: { quantidade: 1, status: 1 }
  });
  
  const { data: produtos } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll });
  const { data: almoxarifados } = useQuery({ queryKey: ['almoxarifados'], queryFn: almoxarifadoService.getAll });
  const { data: fases } = useQuery({ queryKey: ['fasesProducao'], queryFn: faseProducaoService.getAll });
  const { data: tiposOP } = useQuery({ queryKey: ['tiposOrdemDeProducao'], queryFn: tipoOrdemDeProducaoService.getAll });
  
  const { data: ordem, isLoading: isLoadingOrdem } = useQuery({
    queryKey: ['ordemDeProducao', id],
    queryFn: () => ordemDeProducaoService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && ordem) {
      reset({
        id: ordem.id,
        codigoOrdem: ordem.codigoOrdem,
        quantidade: ordem.quantidade,
        observacoes: ordem.observacoes || "",
        produtoId: ordem.produtoId,
        almoxarifadoId: ordem.almoxarifadoId,
        faseAtualId: ordem.faseAtualId,
        tipoOrdemDeProducaoId: ordem.tipoOrdemDeProducaoId,
        loteId: ordem.loteId || null,
        status: ordem.status, 
      });
    } else if (!isEditing) {
        const faseInicial = fases?.find(f => f.ordem === 1);
        reset({
            faseAtualId: faseInicial?.id || '',
            status: 1
        });
    }
  }, [ordem, isEditing, reset, fases]);


  const createMutation = useMutation({
    mutationFn: ordemDeProducaoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      navigate(basePath);
    },
    onError: (error) => {
      console.error("Erro ao criar Ordem de Produção:", error);
      alert(`Falha ao criar a OP: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => ordemDeProducaoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
      queryClient.invalidateQueries({ queryKey: ['ordemDeProducao', id] });
      navigate(basePath);
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar OP: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
        Id: isEditing ? id : undefined,
        CodigoOrdem: data.codigoOrdem,
        Quantidade: data.quantidade,
        Observacoes: data.observacoes || "",
        ProdutoId: data.produtoId,
        AlmoxarifadoId: data.almoxarifadoId,
        FaseAtualId: data.faseAtualId,
        TipoOrdemDeProducaoId: data.tipoOrdemDeProducaoId,
        LoteId: data.loteId || null,
    };
    
    if (isEditing) {
        mappedData.Status = data.status; 
        updateMutation.mutate(mappedData);
    } else {
        createMutation.mutate(mappedData);
    }
  };

  const isLoadingData = [produtos, almoxarifados, fases, tiposOP].some(q => q.isLoading) || isLoadingOrdem;
  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingData;
  
  if (isEditing && isLoadingOrdem) return <div className="loading-message">Carregando Ordem de Produção...</div>;
  if (isLoadingData) return <div className="loading-message">Carregando dados de cadastros...</div>;


  return (
    <div className="form-container">
      <h1>{isEditing ? `Editar Ordem de Produção: ${ordem?.codigoOrdem}` : 'Criar Nova Ordem de Produção'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="codigoOrdem">Código da OP</label>
          <input id="codigoOrdem" {...register('codigoOrdem')} />
          {errors.codigoOrdem && <span className="error">{errors.codigoOrdem.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="quantidade">Quantidade</label>
          <input id="quantidade" type="number" step="1" {...register('quantidade', { valueAsNumber: true })} />
          {errors.quantidade && <span className="error">{errors.quantidade.message}</span>}
        </div>

        {isEditing && (
            <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" {...register('status', { valueAsNumber: true })}>
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                {errors.status && <span className="error">{errors.status.message}</span>}
            </div>
        )}
        
        <div className="form-group">
          <label htmlFor="produtoId">Produto</label>
          <select id="produtoId" {...register('produtoId')} defaultValue="">
            <option value="" disabled>Selecione um produto</option>
            {produtos?.map(p => (
              <option key={p.id} value={p.id}>{p.nome} ({p.codigo})</option>
            ))}
          </select>
          {errors.produtoId && <span className="error">{errors.produtoId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tipoOrdemDeProducaoId">Tipo de OP</label>
          <select id="tipoOrdemDeProducaoId" {...register('tipoOrdemDeProducaoId')} defaultValue="">
            <option value="" disabled>Selecione o tipo</option>
            {tiposOP?.map(t => (
              <option key={t.id} value={t.id}>{t.nome} ({t.codigo})</option>
            ))}
          </select>
          {errors.tipoOrdemDeProducaoId && <span className="error">{errors.tipoOrdemDeProducaoId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="almoxarifadoId">Almoxarifado de Destino</label>
          <select id="almoxarifadoId" {...register('almoxarifadoId')} defaultValue="">
            <option value="" disabled>Selecione o almoxarifado</option>
            {almoxarifados?.map(a => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </select>
          {errors.almoxarifadoId && <span className="error">{errors.almoxarifadoId.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="faseAtualId">Fase Atual/Inicial</label>
          <select id="faseAtualId" {...register('faseAtualId')} defaultValue="">
            <option value="" disabled>Selecione a fase</option>
            {fases?.sort((a, b) => a.ordem - b.ordem).map(f => (
              <option key={f.id} value={f.id}>{f.ordem} - {f.nome}</option>
            ))}
          </select>
          {errors.faseAtualId && <span className="error">{errors.faseAtualId.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="loteId">Lote (Opcional)</label>
          <input id="loteId" {...register('loteId')} placeholder="Insira o ID do Lote se aplicável" />
          {errors.loteId && <span className="error">{errors.loteId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea id="observacoes" {...register('observacoes')} rows="3" />
          {errors.observacoes && <span className="error">{errors.observacoes.message}</span>}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate(basePath)} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={isPending}>
            {isPending ? (isEditing ? 'Salvando...' : 'Criando...') : 'Salvar'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default OrdemDeProducaoForm;