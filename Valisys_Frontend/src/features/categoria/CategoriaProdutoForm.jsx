import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import categoriaProdutoService from '../../services/categoriaProdutoService.js';
import '../../features/produto/ProdutoForm.css';

const MAX_STRING_LENGTH = 100;
const MAX_CODE_LENGTH = 10;

const baseSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome da categoria é obrigatório.").max(MAX_STRING_LENGTH),
  codigo: z.string().min(1, "O código é obrigatório.").max(MAX_CODE_LENGTH),
  descricao: z.string().min(1, "A descrição é obrigatória.").max(500),
  ativo: z.boolean().default(true),
});

const updateSchema = z.object({
    id: z.string().uuid(),
    nome: z.string().min(1, "O nome da categoria é obrigatório.").max(MAX_STRING_LENGTH),
    codigo: z.string().min(1, "O código é obrigatório.").max(MAX_CODE_LENGTH),
    ativo: z.boolean().default(true),
});


function CategoriaProdutoForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const basePath = '/settings/cadastros/categorias';
  
  const schema = isEditing ? updateSchema : baseSchema;

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ativo: true, nome: '', codigo: '', descricao: '' }
  });

  const { data: categoria, isLoading: isLoadingCategoria } = useQuery({
    queryKey: ['categoriaProduto', id],
    queryFn: () => categoriaProdutoService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && categoria) {
      reset({
        id: categoria.id,
        nome: categoria.nome,
        codigo: categoria.codigo || '',
        descricao: categoria.descricao || '', 
        ativo: categoria.ativo ?? true,
      });
    }
  }, [categoria, isEditing, reset]);

  const createMutation = useMutation({
    mutationFn: categoriaProdutoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriasProduto'] });
      navigate(basePath);
    },
    onError: (error) => {
      console.error("Erro ao criar categoria:", error);
      alert(`Falha ao criar a categoria: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => categoriaProdutoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriasProduto'] });
      queryClient.invalidateQueries({ queryKey: ['categoriaProduto', id] });
      navigate(basePath);
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar categoria: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
        Id: isEditing ? id : undefined, 
        Nome: data.nome,
        Codigo: data.codigo,
        Ativo: data.ativo,
    };
    
    if (!isEditing) {
        mappedData.Descricao = data.descricao;
    }
    
    if (isEditing) {
      updateMutation.mutate(mappedData);
    } else {
      createMutation.mutate(mappedData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingCategoria;

  if (isEditing && isLoadingCategoria) return <div className="loading-message">Carregando categoria...</div>;

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Categoria de Produto' : 'Adicionar Nova Categoria de Produto'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome da Categoria</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="codigo">Código</label>
          <input id="codigo" {...register('codigo')} />
          {errors.codigo && <span className="error">{errors.codigo.message}</span>}
        </div>

        {!isEditing && (
            <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea id="descricao" {...register('descricao')} rows="3" />
                {errors.descricao && <span className="error">{errors.descricao.message}</span>}
            </div>
        )}

        <div className="form-group-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Categoria Ativa?</label>
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

export default CategoriaProdutoForm;