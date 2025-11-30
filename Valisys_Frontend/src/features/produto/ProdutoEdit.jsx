import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import produtoService from '../../services/produtoService.js';
import categoriaProdutoService from '../../services/categoriaProdutoService.js';
import unidadeMedidaService from '../../services/unidadeMedidaService.js';

import './ProdutoForm.css';

const produtoSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório (min 3 letras)."),
  descricao: z.string().min(1, "Descrição obrigatória."),
  codigo: z.string().min(1, "Código obrigatório."),
  estoqueMinimo: z.coerce.number().min(0, "Estoque mínimo deve ser positivo."),
  controlarPorLote: z.boolean(),
  ativo: z.boolean(),
  classificacao: z.coerce.number().min(1, "Selecione uma classificação"),
  unidadeMedidaId: z.string().min(0, "Selecione uma Unidade válida.").uuid("ID inválido."),
  categoriaProdutoId: z.string().min(1, "Selecione uma Categoria válida.").uuid("ID inválido."),
  
  almoxarifadoEstoqueId: z.string().optional().nullable()
});

const CLASSIFICACAO_OPTIONS = [
  { value: 0, label: 'Matéria Prima' },
  { value: 1, label: 'Componente' },
  { value: 2, label: 'Semi-Acabado' },
  { value: 3, label: 'Produto Acabado' },
  { value: 4, label: 'Material de Consumo' }
];

function ProdutoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      ativo: true,
      controlarPorLote: false,
      estoqueMinimo: 0
    }
  });

  const { data: produto, isLoading: isLoadingProduto } = useQuery({
    queryKey: ['produto', id],
    queryFn: () => produtoService.getById(id)
  });

  const { data: categorias, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ['categoriasProduto'],
    queryFn: categoriaProdutoService.getAll
  });

  const { data: unidades, isLoading: isLoadingUnidades } = useQuery({
    queryKey: ['unidadesMedida'],
    queryFn: unidadeMedidaService.getAll
  });

  useEffect(() => {
    if (produto) {
      reset({
        ...produto,
        classificacao: produto.classificacaoId,
        estoqueMinimo: produto.estoqueMinimo ?? 0,
        observacoes: produto.observacoes || "",
        almoxarifadoEstoqueId: produto.almoxarifadoEstoqueId || null,
        controlarPorLote: produto.controlarPorLote ?? false,
        ativo: produto.ativo ?? true
      });
    }
  }, [produto, reset]);

  const updateMutation = useMutation({
    mutationFn: (data) => produtoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      queryClient.invalidateQueries({ queryKey: ['produto', id] });
      navigate('/estoque/produtos');
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
      Id: id,
      ...data, 
      Classificacao: Number(data.classificacao)
    };
    updateMutation.mutate(mappedData);
  };

  const isLoadingGlobal = isLoadingProduto || isLoadingCategorias || isLoadingUnidades;

  if (isLoadingGlobal) return <div className="loading-message">Carregando dados do produto...</div>;

  return (
    <div className="form-container">
      <h1>Editar Produto</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <input id="descricao" {...register('descricao')} />
          {errors.descricao && <span className="error">{errors.descricao.message}</span>}
        </div>

        

        <div className="form-group">
          <label htmlFor="categoriaProdutoId">Categoria</label>
          <select id="categoriaProdutoId" {...register('categoriaProdutoId')}>
            <option value="" disabled>Selecione</option>
            {categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          {errors.categoriaProdutoId && <span className="error">{errors.categoriaProdutoId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="unidadeMedidaId">Unidade</label>
          <select id="unidadeMedidaId" {...register('unidadeMedidaId')}>
            <option value="" disabled>Selecione</option>
            {unidades?.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
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
            {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProdutoEdit;