import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import loteService from '../../services/loteService.js';
import produtoService from '../../services/produtoService.js';
import almoxarifadoService from '../../services/almoxarifadoService.js';

import '../../features/produto/ProdutoForm.css';

// Esquema de validação ajustado para ser mais flexível com selects
const loteSchema = z.object({
  codigoLote: z.string().min(1, "O código do lote é obrigatório.").max(50),
  // Usamos .min(1) em vez de .uuid() para garantir que algo foi selecionado
  // Isso evita o erro "ID inválido" quando o campo está vazio ou em formato inesperado
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
    // Valores padrão iniciais para evitar componentes não controlados
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
        // Garante que lemos o ID corretamente independente se vier id ou Id
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
      <h1>{isEditing ? 'Editar Lote' : 'Criar Novo Lote'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="codigoLote">Código/Número do Lote</label>
          <input id="codigoLote" {...register('codigoLote')} placeholder="Ex: LT-2024-AB" />
          {errors.codigoLote && <span className="error">{errors.codigoLote.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="produtoId">Produto</label>
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
          <label htmlFor="almoxarifadoId">Almoxarifado (Localização)</label>
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
                <input type="date" id="dataFabricacao" {...register('dataFabricacao')} />
            </div>
            <div className="form-group" style={{flex: 1}}>
                <label htmlFor="dataVencimento">Data de Validade (Opcional)</label>
                <input type="date" id="dataVencimento" {...register('dataVencimento')} />
            </div>
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" {...register('descricao')} rows={2} />
        </div>

        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea id="observacoes" {...register('observacoes')} rows={2} />
        </div>

        {isEditing && (
            <div className="form-group-checkbox">
            <input type="checkbox" id="ativo" {...register('ativo')} />
            <label htmlFor="ativo">Lote Ativo?</label>
            </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/producao/lotes')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={mutation.isPending || isSubmitting}>
            {mutation.isPending ? 'Salvando...' : 'Salvar Lote'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default LoteForm;