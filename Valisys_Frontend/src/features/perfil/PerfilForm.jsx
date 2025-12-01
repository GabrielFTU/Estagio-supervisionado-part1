import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, X, Shield, User, Save } from 'lucide-react'; 

import perfilService from '../../services/perfilService.js';
import { MODULOS_SISTEMA } from '../../utils/modulos.js'; 
import '../../features/produto/ProdutoForm.css'; 
import './PerfilForm.css'; 

const perfilSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
  ativo: z.boolean().default(true),
  acessos: z.array(z.string()).optional() 
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
    defaultValues: { ativo: true, nome: '', acessos: [] } 
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
        ativo: perfil.ativo,
        acessos: perfil.acessos || [] 
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
        Ativo: data.ativo,
        Acessos: data.acessos 
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
      <div className="form-header">
        <h1>
            <Shield size={24} className="text-primary" />
            {isEditing ? 'Editar Perfil' : 'Novo Perfil'}
        </h1>
        <p>Defina o nome do perfil e selecione as permissões de acesso ao sistema.</p>
      </div>
      
      {feedbackMessage && (
        <div className={`feedback-box ${feedbackMessage.type}`}>
            {feedbackMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{feedbackMessage.text}</span>
            <button onClick={() => setFeedbackMessage(null)}>
                <X size={18} />
            </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">
            <User size={16} /> NOME DO PERFIL
          </label>
          <input id="nome" {...register('nome')} placeholder="Ex: Gerente de Produção" autoFocus />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="permissions-section">
            <div className="permissions-header">
                <Shield size={18} />
                <h3>Permissões de Acesso</h3>
            </div>
            
            <div className="permissions-grid">
                {MODULOS_SISTEMA.map((modulo) => (
                    <div key={modulo.id} className="permission-item">
                        <input 
                            type="checkbox" 
                            value={modulo.id}
                            {...register('acessos')} 
                            id={`acesso-${modulo.id}`}
                        />
                        <label htmlFor={`acesso-${modulo.id}`}>
                            {modulo.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>

        <div className="form-group-checkbox status-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Perfil Ativo?</label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/settings/perfis')} className="btn-cancelar">
            <X size={18} /> Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={isPending}>
            {isPending ? 'Salvando...' : <><Save size={18} /> Salvar</>}
          </button>
        </div>

      </form>
    </div>
  );
}

export default PerfilForm;