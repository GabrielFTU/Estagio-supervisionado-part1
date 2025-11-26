import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import tipoOrdemDeProducaoService from '../../services/tipoOrdemDeProducaoService.js';
import '../../features/produto/ProdutoForm.css';

const MAX_STRING_LENGTH = 100;
const MAX_CODE_LENGTH = 10;

const tipoOrdemDeProducaoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome do tipo de ordem é obrigatório.").max(MAX_STRING_LENGTH),
  codigo: z.string().min(1, "O código é obrigatório.").max(MAX_CODE_LENGTH),
  ativo: z.boolean().default(true),
});


function TipoOrdemDeProducaoForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const basePath = '/settings/cadastros/tiposop';
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(tipoOrdemDeProducaoSchema),
    defaultValues: { ativo: true, nome: '', codigo: '' }
  });

  const { data: tipoOrdem, isLoading: isLoadingTipoOrdem } = useQuery({
    queryKey: ['tipoOrdemDeProducao', id],
    queryFn: () => tipoOrdemDeProducaoService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && tipoOrdem) {
      reset({
        id: tipoOrdem.id,
        nome: tipoOrdem.nome,
        codigo: tipoOrdem.codigo,
        ativo: tipoOrdem.ativo ?? true,
      });
    }
  }, [tipoOrdem, isEditing, reset]);

  const createMutation = useMutation({
    mutationFn: tipoOrdemDeProducaoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposOrdemDeProducao'] });
      navigate(basePath);
    },
    onError: (error) => {
      console.error("Erro ao criar Tipo de OP:", error);
      alert(`Falha ao criar o Tipo de OP: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => tipoOrdemDeProducaoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposOrdemDeProducao'] });
      queryClient.invalidateQueries({ queryKey: ['tipoOrdemDeProducao', id] });
      navigate(basePath);
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar Tipo de OP: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
        Id: isEditing ? id : undefined, 
        Nome: data.nome,
        Codigo: data.codigo,
        Ativo: data.ativo,
    };
    
    if (isEditing) {
      updateMutation.mutate(mappedData);
    } else {
      createMutation.mutate(mappedData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingTipoOrdem;

  if (isEditing && isLoadingTipoOrdem) return <div className="loading-message">Carregando Tipo de OP...</div>;

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Tipo de Ordem de Produção' : 'Adicionar Novo Tipo de Ordem de Produção'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome do Tipo de Ordem</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="codigo">Código (Sigla)</label>
          <input id="codigo" {...register('codigo')} />
          {errors.codigo && <span className="error">{errors.codigo.message}</span>}
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Tipo de OP Ativo?</label>
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

export default TipoOrdemDeProducaoForm;