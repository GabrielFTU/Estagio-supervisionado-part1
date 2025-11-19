import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import unidadeMedidaService from '../../services/unidadeMedidaService.js';
import '../../features/produto/ProdutoForm.css';

const MAX_NAME_LENGTH = 50;
const MAX_SIGLA_LENGTH = 10;

const unidadeMedidaSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome é obrigatório.").max(MAX_NAME_LENGTH, `Máximo ${MAX_NAME_LENGTH} caracteres.`),
  sigla: z.string().min(1, "A sigla é obrigatória.").max(MAX_SIGLA_LENGTH, `Máximo ${MAX_SIGLA_LENGTH} caracteres.`),
});


function UnidadeMedidaForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const basePath = '/settings/cadastros/unidades';
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(unidadeMedidaSchema),
    defaultValues: { nome: '', sigla: '' }
  });

  // Fetch data in edit mode
  const { data: unidade, isLoading: isLoadingUnidade } = useQuery({
    queryKey: ['unidadeMedida', id],
    queryFn: () => unidadeMedidaService.getById(id),
    enabled: isEditing,
  });

  // Populate form fields on data load (Edit mode)
  useEffect(() => {
    if (isEditing && unidade) {
      reset({
        id: unidade.id,
        nome: unidade.nome,
        sigla: unidade.sigla,
      });
    }
  }, [unidade, isEditing, reset]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: unidadeMedidaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidadesMedida'] });
      navigate(basePath);
    },
    onError: (error) => {
      console.error("Erro ao criar Unidade de Medida:", error);
      alert(`Falha ao criar a Unidade de Medida: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => unidadeMedidaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidadesMedida'] });
      queryClient.invalidateQueries({ queryKey: ['unidadeMedida', id] });
      navigate(basePath);
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar Unidade de Medida: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    // Mapeamento de Casing (Front-end camelCase para Back-end PascalCase)
    // O controller C# (UnidadeMedidaController.cs) espera o modelo completo (Id, Nome, Sigla)
    const mappedData = {
        Id: isEditing ? id : undefined, 
        Nome: data.nome,
        Sigla: data.sigla,
    };
    
    if (isEditing) {
      updateMutation.mutate(mappedData);
    } else {
      createMutation.mutate(mappedData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingUnidade;

  if (isEditing && isLoadingUnidade) return <div className="loading-message">Carregando Unidade de Medida...</div>;

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Unidade de Medida' : 'Adicionar Nova Unidade de Medida'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="sigla">Sigla</label>
          <input id="sigla" {...register('sigla')} />
          {errors.sigla && <span className="error">{errors.sigla.message}</span>}
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

export default UnidadeMedidaForm;