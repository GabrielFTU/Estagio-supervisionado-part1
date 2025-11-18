import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import perfilService from '../../services/perfilService.js';
import '../../features/produto/ProdutoForm.css'; 

const perfilSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
  ativo: z.boolean().default(true),
});

function PerfilForm() {
  const { id } = useParams(); 
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(perfilSchema)
  });

  
  const { data: perfil, isLoading: isLoadingPerfil } = useQuery({
    queryKey: ['perfil', id],
    queryFn: () => perfilService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && perfil) {
      reset({
        id: perfil.id,
        nome: perfil.nome,
        ativo: perfil.ativo
      });
    } else if (!isEditing) {
      
      reset({ nome: '', ativo: true });
    }
  }, [perfil, isEditing, reset]);

 
  const createMutation = useMutation({
    mutationFn: perfilService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis'] });
      navigate('/configuracoes/perfis');
    },
    onError: (error) => {
      console.error("Erro ao criar perfil:", error);
      alert(`Falha ao criar o perfil: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => perfilService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis'] });
      queryClient.invalidateQueries({ queryKey: ['perfil', id] });
      navigate('/configuracoes/perfis');
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar perfil: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingPerfil;

  if (isEditing && isLoadingPerfil) return <div className="loading-message">Carregando perfil...</div>;

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Perfil' : 'Adicionar Novo Perfil'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome do Perfil</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Perfil Ativo?</label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/configuracoes/perfis')} className="btn-cancelar">
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

export default PerfilForm;