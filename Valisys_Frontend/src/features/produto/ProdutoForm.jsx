import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import produtoService from '../../services/produtoService.js';
import categoriaProdutoService from '../../services/categoriaProdutoService.js';
import unidadeMedidaService from '../../services/unidadeMedidaService.js';

import './ProdutoForm.css';

const produtoSchema = z.object({
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
  descricao: z.string().min(1, "A descrição é obrigatória."),
  codigoInternoProduto: z.string().min(1, "O código é obrigatório."),
  controlarPorLote: z.boolean().default(false),
  observacoes: z.string().optional(),
  
  unidadeMedidaId: z.string().uuid("Você deve selecionar uma Unidade de Medida."),
  categoriaProdutoId: z.string().uuid("Você deve selecionar uma Categoria."),
});

function ProdutoForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(produtoSchema)
  });

  const { data: categorias, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ['categoriasProduto'],
    queryFn: categoriaProdutoService.getAll
  });

  const { data: unidades, isLoading: isLoadingUnidades } = useQuery({
    queryKey: ['unidadesMedida'],
    queryFn: unidadeMedidaService.getAll
  });

  const createProdutoMutation = useMutation({
    mutationFn: produtoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      navigate('/produtos');
    },
    onError: (error) => {
      console.error("Erro ao criar produto:", error);
      alert("Falha ao criar o produto. Tente novamente.");
    }
  });

  const onSubmit = (data) => {
    createProdutoMutation.mutate(data);
  };

  return (
    <div className="form-container">
      <h1>Adicionar Novo Produto</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        

        <div className="form-group">
          <label htmlFor="nome">Nome do Produto</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

   
        <div className="form-group">
          <label htmlFor="codigoInternoProduto">Código Interno</label>
          <input id="codigoInternoProduto" {...register('codigoInternoProduto')} />
          {errors.codigoInternoProduto && <span className="error">{errors.codigoInternoProduto.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="categoriaProdutoId">Categoria</label>
          <select id="categoriaProdutoId" {...register('categoriaProdutoId')} defaultValue="">
            <option value="" disabled>
              {isLoadingCategorias ? 'Carregando...' : 'Selecione uma categoria'}
            </option>
            {categorias?.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
          {errors.categoriaProdutoId && <span className="error">{errors.categoriaProdutoId.message}</span>}
        </div>

    
        <div className="form-group">
          <label htmlFor="unidadeMedidaId">Unidade de Medida</label>
          <select id="unidadeMedidaId" {...register('unidadeMedidaId')} defaultValue="">
            <option value="" disabled>
              {isLoadingUnidades ? 'Carregando...' : 'Selecione uma unidade'}
            </option>
            {unidades?.map(un => (
              <option key={un.id} value={un.id}>{un.nome} ({un.sigla})</option>
            ))}
          </select>
          {errors.unidadeMedidaId && <span className="error">{errors.unidadeMedidaId.message}</span>}
        </div>

      
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" {...register('descricao')} rows={3}></textarea>
          {errors.descricao && <span className="error">{errors.descricao.message}</span>}
        </div>
        
      
        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea id="observacoes" {...register('observacoes')} rows={3}></textarea>
        </div>

        
        <div className="form-group-checkbox">
          <input type="checkbox" id="controlarPorLote" {...register('controlarPorLote')} />
          <label htmlFor="controlarPorLote">Controlar por Lote?</label>
        </div>
        
       
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/produtos')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={createProdutoMutation.isPending}>
            {createProdutoMutation.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProdutoForm;