import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

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
  
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(perfilSchema),
    defaultValues: { ativo: true, nome: '' }
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
    }
  }, [perfil, isEditing, reset]);

  const handleMutationError = (error) => {
      console.error("Erro na operação:", error);
      const serverMessage = error.response?.data?.message || error.response?.data?.title || error.message;
      setFeedbackMessage({ 
          type: 'error', 
          text: `Falha ao salvar: ${serverMessage}` 
      });
  };

  const createMutation = useMutation({
    mutationFn: perfilService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis'] });
      navigate('/settings/perfis');
    },
    onError: handleMutationError
  });

  const updateMutation = useMutation({
    mutationFn: (data) => perfilService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis'] });
      queryClient.invalidateQueries({ queryKey: ['perfil', id] });
      navigate('/settings/perfis');
    },
    onError: handleMutationError
  });

  const onSubmit = (data) => {
    setFeedbackMessage(null);

    const dataToSend = {
        Id: isEditing ? id : undefined,
        Nome: data.nome,
        Ativo: data.ativo
    };

    if (isEditing) {
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingPerfil;

  if (isEditing && isLoadingPerfil) return <div className="loading-message">Carregando perfil...</div>;

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Perfil' : 'Adicionar Novo Perfil'}</h1>
      
      {feedbackMessage && (
        <div 
            className={`feedback-box ${feedbackMessage.type}`}
            style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: feedbackMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${feedbackMessage.type === 'success' ? '#22c55e' : '#ef4444'}`,
                color: feedbackMessage.type === 'success' ? '#22c55e' : '#ef4444',
            }}
        >
            {feedbackMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span style={{ flexGrow: 1, fontSize: '0.9rem' }}>{feedbackMessage.text}</span>
            <button onClick={() => setFeedbackMessage(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                <X size={18} />
            </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome do Perfil</label>
          <input id="nome" {...register('nome')} placeholder="Ex: Gerente de Produção" />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Perfil Ativo?</label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/settings/perfis')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default PerfilForm;