import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, X, Hash, Package, MapPin, Calendar, 
  FileText, Info, Layers 
} from 'lucide-react';

import loteService from '../../services/loteService.js';
import produtoService from '../../services/produtoService.js';
import almoxarifadoService from '../../services/almoxarifadoService.js';

import '../../features/produto/ProdutoForm.css';

const loteSchema = z.object({
  codigoLote: z.string().min(1, "O código do lote é obrigatório.").max(50),
  produtoId: z.string().min(1, "Selecione um Produto."),
  almoxarifadoId: z.string().min(1, "Selecione um Almoxarifado."),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
  dataFabricacao: z.string().optional(), 
  dataVencimento: z.string().optional().nullable(),
  ativo: z.boolean().default(true)
});

function LoteForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      ativo: true,
      descricao: '',
      observacoes: '',
      produtoId: '',
      almoxarifadoId: '',
      dataFabricacao: new Date().toISOString().split('T')[0]
    }
  });

  const { data: produtos } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll });
  const { data: almoxarifados } = useQuery({ queryKey: ['almoxarifados'], queryFn: almoxarifadoService.getAll });
  
  const { data: lote, isLoading: isLoadingLote } = useQuery({
    queryKey: ['lote', id],
    queryFn: () => loteService.getById(id),
    enabled: isEditing
  });

  useEffect(() => {
    if (isEditing && lote) {
      reset({
        codigoLote: lote.numeroLote || lote.codigoLote,
        produtoId: lote.produtoId || lote.ProdutoId || '',
        almoxarifadoId: lote.almoxarifadoId || lote.AlmoxarifadoId || '', 
        descricao: lote.descricao || '',
        observacoes: lote.observacoes || '',
        dataFabricacao: lote.dataFabricacao ? new Date(lote.dataFabricacao).toISOString().split('T')[0] : '',
        dataVencimento: lote.dataVencimento ? new Date(lote.dataVencimento).toISOString().split('T')[0] : null,
        ativo: lote.ativo ?? true
      });
    }
  }, [isEditing, lote, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? loteService.update(id, data) : loteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      navigate('/producao/lotes');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || error.message;
      alert(`Erro ao salvar lote: ${msg}`);
    }
  });

  const onSubmit = (data) => {
    const dataToSend = {
        ...data,
        dataVencimento: data.dataVencimento || null 
    };
    mutation.mutate(dataToSend);
  };

  const isLoadingDependencies = !produtos || !almoxarifados || (isEditing && isLoadingLote);

  if (isLoadingDependencies) return <div className="loading-message">Carregando dados...</div>;

  return (
    <div className="form-container">
      <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            <Layers size={24} className="text-primary" />
            {isEditing ? 'Editar Lote' : 'Criar Novo Lote'}
        </h1>
        <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gerencie o rastreamento e validade dos lotes de produtos.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
<<<<<<< HEAD
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="codigoLote" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Hash size={16} /> CÓDIGO / NÚMERO <span style={{color: 'var(--color-danger)'}}>*</span>
              </label>
              <input 
                id="codigoLote" 
                {...register('codigoLote')} 
                placeholder="Ex: LT-2024-A01" 
                autoFocus
                style={{fontWeight: 'bold'}}
              />
              {errors.codigoLote && <span className="error">{errors.codigoLote.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="produtoId" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Package size={16} /> PRODUTO <span style={{color: 'var(--color-danger)'}}>*</span>
              </label>
              <select id="produtoId" {...register('produtoId')} disabled={isEditing && lote}>
                <option value="" disabled>Selecione o produto...</option>
                {produtos?.filter(p => p.controlarPorLote || p.ControlarPorLote).map(p => (
                  <option key={p.id || p.Id} value={p.id || p.Id}>
                    {p.nome || p.Nome} ({p.codigo || p.Codigo || p.CodigoInternoProduto})
                  </option>
                ))}
              </select>
              <small style={{color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px'}}>
                Apenas produtos configurados para controle por lote são exibidos.
              </small>
              {errors.produtoId && <span className="error">{errors.produtoId.message}</span>}
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="almoxarifadoId" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={16} /> LOCALIZAÇÃO (ALMOXARIFADO) <span style={{color: 'var(--color-danger)'}}>*</span>
              </label>
              <select id="almoxarifadoId" {...register('almoxarifadoId')}>
                <option value="" disabled>Selecione o local...</option>
                {almoxarifados?.map(a => (
                  <option key={a.id || a.Id} value={a.id || a.Id}>
                    {a.nome || a.Nome}
                  </option>
                ))}
              </select>
              {errors.almoxarifadoId && <span className="error">{errors.almoxarifadoId.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="dataFabricacao" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                   <Calendar size={16} /> FABRICAÇÃO
                </label>
=======
        <div className="form-group">
          <label htmlFor="codigoLote">Código/Número do Lote<span style={{color: 'var(--color-danger)'}}>*</span></label>
          <input id="codigoLote" {...register('codigoLote')} placeholder="Ex: LT-2024-AB" />
          {errors.codigoLote && <span className="error">{errors.codigoLote.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="produtoId">Produto<span style={{color: 'var(--color-danger)'}}>*</span></label>
          <select id="produtoId" {...register('produtoId')} disabled={isEditing && lote}>
            <option value="" disabled>Selecione o produto...</option>
            {produtos?.filter(p => p.controlarPorLote || p.ControlarPorLote).map(p => (
              <option key={p.id || p.Id} value={p.id || p.Id}>
                {p.nome || p.Nome} ({p.codigo || p.Codigo || p.CodigoInternoProduto})
              </option>
            ))}
          </select>
          <small style={{color: '#666'}}>Apenas produtos controlados por lote são exibidos.</small>
          {errors.produtoId && <span className="error">{errors.produtoId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="almoxarifadoId">Almoxarifado (Localização)<span style={{color: 'var(--color-danger)'}}>*</span></label>
          <select id="almoxarifadoId" {...register('almoxarifadoId')}>
            <option value="" disabled>Selecione o almoxarifado...</option>
            {almoxarifados?.map(a => (
              <option key={a.id || a.Id} value={a.id || a.Id}>
                {a.nome || a.Nome}
              </option>
            ))}
          </select>
          {errors.almoxarifadoId && <span className="error">{errors.almoxarifadoId.message}</span>}
        </div>

        <div style={{display: 'flex', gap: '20px'}}>
            <div className="form-group" style={{flex: 1}}>
                <label htmlFor="dataFabricacao">Data de Fabricação/Abertura</label>
>>>>>>> refs/remotes/origin/main
                <input type="date" id="dataFabricacao" {...register('dataFabricacao')} />
            </div>
            
            <div className="form-group">
                <label htmlFor="dataVencimento" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                   <Calendar size={16} /> VALIDADE
                </label>
                <input type="date" id="dataVencimento" {...register('dataVencimento')} />
            </div>
        </div>

        <div className="form-group">
          <label htmlFor="descricao" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FileText size={16} /> DESCRIÇÃO
          </label>
          <textarea id="descricao" {...register('descricao')} rows={2} placeholder="Detalhes específicos deste lote..." />
        </div>

        <div className="form-group">
          <label htmlFor="observacoes" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Info size={16} /> OBSERVAÇÕES
          </label>
          <textarea id="observacoes" {...register('observacoes')} rows={2} placeholder="Informações adicionais de controle..." />
        </div>

        {isEditing && (
          <div className="form-group-checkbox" style={{backgroundColor: 'var(--bg-tertiary)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
            <input type="checkbox" id="ativo" {...register('ativo')} />
            <label htmlFor="ativo" style={{cursor: 'pointer', fontWeight: 'bold'}}>Lote Ativo?</label>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/producao/lotes')} 
            className="btn-cancelar"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <X size={18} /> Cancelar
          </button>
          
          <button 
            type="submit" 
            className="btn-salvar" 
            disabled={mutation.isPending || isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {mutation.isPending ? 'Salvando...' : <><Save size={18} /> Salvar Lote</>}
          </button>
        </div>

      </form>
    </div>
  );
}

export default LoteForm;