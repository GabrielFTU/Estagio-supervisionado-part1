import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import faseProducaoService from '../../services/faseProducaoService.js';
import '../../features/produto/ProdutoForm.css';

const MAX_STRING_LENGTH = 100;

const faseProducaoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome da fase é obrigatório.").max(MAX_STRING_LENGTH),
  descricao: z.string().optional(),
  ordem: z.coerce.number().min(1, "A ordem deve ser um número positivo (mínimo 1).").max(100),
  tempoPadraoDias: z.coerce.number().min(0, "O tempo não pode ser negativo."), 
  ativo: z.boolean().default(true),
});

function FaseProducaoForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const basePath = '/settings/cadastros/fases';
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(faseProducaoSchema),
    defaultValues: { ativo: true, nome: '', ordem: 1, tempoPadraoDias: 0 }
  });

  const { data: fase, isLoading: isLoadingFase } = useQuery({
    queryKey: ['faseProducao', id],
    queryFn: () => faseProducaoService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && fase) {
      reset({
        id: fase.id,
        nome: fase.nome,
        descricao: fase.descricao || '',
        ordem: fase.ordem,
        tempoPadraoDias: Number(fase.tempoPadraoDias ?? 0), 
        ativo: fase.ativo ?? true,
      });
    }
  }, [fase, isEditing, reset]);

  const createMutation = useMutation({
    mutationFn: faseProducaoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasesProducao'] });
      navigate(basePath);
    },
    onError: (error) => {
      console.error("Erro ao criar Fase de Produção:", error);
      const msg = error.response?.data?.message || error.message;
      alert(`Falha ao criar a Fase de Produção: ${msg}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => faseProducaoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasesProducao'] });
      queryClient.invalidateQueries({ queryKey: ['faseProducao', id] });
      navigate(basePath);
    },
    onError: (err) => {
      console.error(err);
      const msg = err.response?.data?.message || err.message;
      alert(`Erro ao atualizar Fase de Produção: ${msg}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
        Id: isEditing ? id : undefined, 
        Nome: data.nome,
        Descricao: data.descricao, 
        Ordem: Number(data.ordem),
        TempoPadraoDias: Number(data.tempoPadraoDias),
        Ativo: data.ativo,
    };
    
    if (isEditing) {
      updateMutation.mutate(mappedData);
    } else {
      createMutation.mutate(mappedData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingFase;

  if (isEditing && isLoadingFase) return <div className="loading-message">Carregando Fase de Produção...</div>;

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Fase de Produção' : 'Adicionar Nova Fase de Produção'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome da Fase</label>
          <input id="nome" {...register('nome')} placeholder="Ex: Corte, Montagem..." />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>
        
        <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea 
                id="descricao" 
                {...register('descricao')} 
                rows="2" 
                placeholder="Detalhes sobre esta etapa do processo..."
            />
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="ordem">Ordem de Execução</label>
                <input 
                    id="ordem" 
                    type="number" 
                    step="1" 
                    {...register('ordem', { valueAsNumber: true })} 
                />
                {errors.ordem && <span className="error">{errors.ordem.message}</span>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="tempoPadraoDias">Duração Padrão (Dias)</label>
                <input 
                    id="tempoPadraoDias" 
                    type="number" 
                    step="1" 
                    {...register('tempoPadraoDias', { valueAsNumber: true })} 
                />
                {errors.tempoPadraoDias && <span className="error">{errors.tempoPadraoDias.message}</span>}
                <small style={{color: '#888', marginTop: '5px'}}>Estimativa para cálculo de prazos.</small>
            </div>
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Fase Ativa?</label>
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

export default FaseProducaoForm;