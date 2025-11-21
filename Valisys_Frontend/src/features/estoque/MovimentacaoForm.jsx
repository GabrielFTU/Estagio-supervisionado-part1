import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import movimentacaoService from '../../services/movimentacaoService.js';
import produtoService from '../../services/produtoService.js';
import almoxarifadoService from '../../services/almoxarifadoService.js';

import '../../features/produto/ProdutoForm.css';

const movimentacaoSchema = z.object({
  produtoId: z.string().uuid("Selecione um Produto."),
  quantidade: z.coerce.number().min(0.01, "A quantidade deve ser maior que zero."),
  almoxarifadoOrigemId: z.string().uuid("Selecione a Origem."),
  almoxarifadoDestinoId: z.string().uuid("Selecione o Destino."),
  observacoes: z.string().optional()
}).refine(data => data.almoxarifadoOrigemId !== data.almoxarifadoDestinoId, {
    message: "Origem e Destino não podem ser iguais",
    path: ["almoxarifadoDestinoId"]
});

function MovimentacaoForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(movimentacaoSchema)
  });

  const { data: produtos } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll });
  const { data: almoxarifados } = useQuery({ queryKey: ['almoxarifados'], queryFn: almoxarifadoService.getAll });

  const createMutation = useMutation({
    mutationFn: movimentacaoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimentacoes'] });
      navigate('/estoque/movimentacoes');
    },
    onError: (error) => {
      console.error("Erro:", error);
      alert(`Falha ao registrar: ${error.response?.data?.message || error.message}`);
    }
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="form-container">
      <h1>Registrar Movimentação de Estoque</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="produtoId">Produto</label>
          <select id="produtoId" {...register('produtoId')} defaultValue="">
            <option value="" disabled>Selecione o produto</option>
            {produtos?.map(p => (
              <option key={p.id} value={p.id}>{p.nome} ({p.codigo})</option>
            ))}
          </select>
          {errors.produtoId && <span className="error">{errors.produtoId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantidade">Quantidade</label>
          <input 
            id="quantidade" 
            type="number" 
            step="0.01" 
            {...register('quantidade')} 
          />
          {errors.quantidade && <span className="error">{errors.quantidade.message}</span>}
        </div>

        <div style={{display: 'flex', gap: '20px'}}>
            <div className="form-group" style={{flex: 1}}>
                <label htmlFor="almoxarifadoOrigemId">Almoxarifado Origem</label>
                <select id="almoxarifadoOrigemId" {...register('almoxarifadoOrigemId')} defaultValue="">
                    <option value="" disabled>Selecione a origem</option>
                    {almoxarifados?.map(a => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                </select>
                {errors.almoxarifadoOrigemId && <span className="error">{errors.almoxarifadoOrigemId.message}</span>}
            </div>

            <div className="form-group" style={{flex: 1}}>
                <label htmlFor="almoxarifadoDestinoId">Almoxarifado Destino</label>
                <select id="almoxarifadoDestinoId" {...register('almoxarifadoDestinoId')} defaultValue="">
                    <option value="" disabled>Selecione o destino</option>
                    {almoxarifados?.map(a => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                </select>
                {errors.almoxarifadoDestinoId && <span className="error">{errors.almoxarifadoDestinoId.message}</span>}
            </div>
        </div>
        
        <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea id="observacoes" {...register('observacoes')} rows="2" />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/estoque/movimentacoes')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Salvando...' : 'Registrar'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default MovimentacaoForm;