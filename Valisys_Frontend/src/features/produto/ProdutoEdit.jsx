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
  
  unidadeMedidaId: z.string().min(1, "Selecione uma Unidade."),
  categoriaProdutoId: z.string().min(1, "Selecione uma Categoria."),
  almoxarifadoEstoqueId: z.string().optional().nullable()
});

function ProdutoEdit() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(produtoSchema)
  });

  const { data: produto, isLoading: isLoadingProduto } = useQuery({
    queryKey: ['produto', id],
    queryFn: () => produtoService.getById(id)
  });

  const { data: categorias } = useQuery({
    queryKey: ['categoriasProduto'],
    queryFn: categoriaProdutoService.getAll
  });

  const { data: unidades } = useQuery({
    queryKey: ['unidadesMedida'],
    queryFn: unidadeMedidaService.getAll
  });

  useEffect(() => {
    if (produto) {
      reset({
        nome: produto.nome,
        descricao: produto.descricao || "", 
        codigo: produto.codigo, 
        estoqueMinimo: produto.estoqueMinimo || 0,
        controlarPorLote: produto.controlarPorLote,
        ativo: produto.ativo,
        unidadeMedidaId: produto.unidadeMedidaId,
        categoriaProdutoId: produto.categoriaProdutoId,
        observacoes: produto.observacoes || "", 
        almoxarifadoEstoqueId: produto.almoxarifadoEstoqueId || null
      });
    }
  }, [produto, reset]);

  const updateMutation = useMutation({
    mutationFn: (data) => produtoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      navigate('/estoque/produtos');
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar produto: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
      Id: id,
      Nome: data.nome,
      Descricao: data.descricao,
      Codigo: data.codigo,
      EstoqueMinimo: data.estoqueMinimo,
      ControlarPorLote: data.controlarPorLote,
      Ativo: data.ativo,
      UnidadeMedidaId: data.unidadeMedidaId,
      CategoriaProdutoId: data.categoriaProdutoId,
      Observacoes: data.observacoes,
      AlmoxarifadoEstoqueId: data.almoxarifadoEstoqueId || null,
    };
    updateMutation.mutate(mappedData);
  };

  if (isLoadingProduto) return <div className="loading-message">Carregando dados...</div>;

  return (
    <div className="form-container">
      <h1>Editar Produto</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label>Nome</label>
          <input {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <input {...register('descricao')} />
          {errors.descricao && <span className="error">{errors.descricao.message}</span>}
        </div>

        <div className="form-group">
          <label>Código</label>
          <input {...register('codigo')} />
          {errors.codigo && <span className="error">{errors.codigo.message}</span>}
        </div>

        <div className="form-group">
          <label>Categoria</label>
          <select {...register('categoriaProdutoId')}>
            <option value="" disabled>Selecione</option>
            {categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          {errors.categoriaProdutoId && <span className="error">{errors.categoriaProdutoId.message}</span>}
        </div>

        <div className="form-group">
          <label>Unidade</label>
          <select {...register('unidadeMedidaId')}>
            <option value="" disabled>Selecione</option>
            {unidades?.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
          </select>
          {errors.unidadeMedidaId && <span className="error">{errors.unidadeMedidaId.message}</span>}
        </div>
        
        <div className="form-group">
          <label>Estoque Mínimo</label>
          <input type="number" step="0.01" {...register('estoqueMinimo')} />
          {errors.estoqueMinimo && <span className="error">{errors.estoqueMinimo.message}</span>}
        </div>
        
        <div className="form-group">
          <label>Observações</label>
          <textarea {...register('observacoes')} rows="3" />
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
          <button type="button" onClick={() => navigate('/estoque/produtos')} className="btn-cancelar">Cancelar</button>
          <button type="submit" className="btn-salvar">Salvar Alterações</button>
        </div>
      </form>
    </div>
  );
}

export default ProdutoEdit;