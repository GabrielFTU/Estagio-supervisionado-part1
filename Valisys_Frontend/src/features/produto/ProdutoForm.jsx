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
  controlarPorLote: z.boolean(),
  observacoes: z.string().optional(),
  classificacao: z.coerce.number().min(0, "Selecione uma classificação válida."),
  unidadeMedidaId: z.string().min(1, "Selecione uma Unidade de Medida."),
  categoriaProdutoId: z.string().min(1, "Selecione uma Categoria."),
});

const CLASSIFICACAO_OPTIONS = [
  { value: 0, label: 'Matéria Prima' },
  { value: 1, label: 'Componente' },
  { value: 2, label: 'Semi-Acabado' },
  { value: 3, label: 'Produto Acabado' },
  { value: 4, label: 'Material de Consumo' },
];

function ProdutoForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      controlarPorLote: false,
      classificacao: "" 
    }
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
      navigate('/estoque/produtos');
    },
    onError: (error) => {
      console.error("Erro ao criar produto:", error);
      const msg = error.response?.data?.message || "Verifique os dados e tente novamente.";
      alert(`Falha ao criar o produto: ${msg}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
      Nome: data.nome,
      Descricao: data.descricao,
      ControlarPorLote: data.controlarPorLote,
      Classificacao: Number(data.classificacao),
      Observacoes: data.observacoes,
      UnidadeMedidaId: data.unidadeMedidaId,
      CategoriaProdutoId: data.categoriaProdutoId,
    };
    createProdutoMutation.mutate(mappedData);
  };

  const isLoadingDependencies = isLoadingCategorias || isLoadingUnidades;
  
  if (isLoadingDependencies) return <div className="loading-message">Carregando opções...</div>;

  return (
    <div className="form-container">
      <h1>Adicionar Novo Produto</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome do Produto</label>
          <input id="nome" {...register('nome')} placeholder="Ex: Parafuso Sextavado" />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="classificacao">Classificação</label>
          <select id="classificacao" {...register('classificacao')}>
            <option value="" disabled>Selecione a classificação</option>
            {CLASSIFICACAO_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.classificacao && <span className="error">{errors.classificacao.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="categoriaProdutoId">Categoria</label>
          <select id="categoriaProdutoId" {...register('categoriaProdutoId')} defaultValue="">
            <option value="" disabled>Selecione uma categoria</option>
            {categorias?.map(cat => (
              <option key={cat.id || cat.Id} value={cat.id || cat.Id}>
                {cat.nome || cat.Nome}
              </option>
            ))}
          </select>
          {errors.categoriaProdutoId && <span className="error">{errors.categoriaProdutoId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="unidadeMedidaId">Unidade de Medida</label>
          <select id="unidadeMedidaId" {...register('unidadeMedidaId')} defaultValue="">
            <option value="" disabled>Selecione uma unidade</option>
            {unidades?.map(un => (
              <option key={un.id || un.Id} value={un.id || un.Id}>
                {un.nome || un.Nome} ({un.sigla || un.Sigla})
              </option>
            ))}
          </select>
          {errors.unidadeMedidaId && <span className="error">{errors.unidadeMedidaId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" {...register('descricao')} rows={3} placeholder="Detalhes técnicos..."></textarea>
          {errors.descricao && <span className="error">{errors.descricao.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea id="observacoes" {...register('observacoes')} rows={2} />
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="controlarPorLote" {...register('controlarPorLote')} />
          <label htmlFor="controlarPorLote">Controlar por Lote?</label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/estoque/produtos')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={createProdutoMutation.isPending || isSubmitting}>
            {createProdutoMutation.isPending ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProdutoForm;