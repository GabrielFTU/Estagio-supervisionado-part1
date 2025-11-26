import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import usuarioService from '../../services/usuarioService.js';
import perfilService from '../../services/perfilService.js';
import '../../features/produto/ProdutoForm.css';

const baseSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome é obrigatório."),
  email: z.string().min(1, "O e-mail é obrigatório.").email("E-mail inválido."),
  perfilId: z.string().min(1, "Você deve selecionar um Perfil."),
  ativo: z.boolean().default(true),
});

const createSchema = baseSchema.extend({
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const updateSchema = baseSchema.extend({
  senha: z.string().optional(), 
});

function UsuarioForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const schema = isEditing ? updateSchema : createSchema;

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(schema)
  });

  const { data: usuario, isLoading: isLoadingUsuario } = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => usuarioService.getById(id),
    enabled: isEditing,
  });

  const { data: perfis, isLoading: isLoadingPerfis } = useQuery({
    queryKey: ['perfis'],
    queryFn: perfilService.getAll
  });

  useEffect(() => {
    if (isEditing && usuario) {
      reset({
        id: usuario.id,
        nome: usuario.nome || '',
        email: usuario.email || '',
        perfilId: usuario.perfilId ? String(usuario.perfilId) : '',
        ativo: usuario.ativo ?? true,
        senha: "" 
      });
    } else if (!isEditing) {
      reset({ nome: '', email: '', perfilId: '', ativo: true, senha: '' });
    }
  }, [usuario, isEditing, reset]);

  const createMutation = useMutation({
    mutationFn: usuarioService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      navigate('/settings/usuarios');
    },
    onError: (error) => {
      console.error("Erro ao criar usuário:", error);
      alert(`Falha ao criar o usuário: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => usuarioService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', id] });
      navigate('/settings/usuarios');
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar usuário: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const dataToSend = { ...data, perfilId: String(data.perfilId) };
    
    if (isEditing) {
      if (!dataToSend.senha) {
          delete dataToSend.senha;
      }
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingUsuario || isLoadingPerfis;

  if (isEditing && isLoadingUsuario) return <div className="loading-message">Carregando usuário...</div>;
  if (isLoadingPerfis) return <div className="loading-message">Carregando perfis...</div>;
  if (isEditing && !usuario) return <div className="error-message">Usuário não encontrado.</div>;
  
  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="perfilId">Perfil</label>
          <select id="perfilId" {...register('perfilId')} defaultValue="">
            <option value="" disabled>
              Selecione um perfil
            </option>
            {perfis?.map(perfil => (
              <option key={perfil.id} value={perfil.id}>{perfil.nome}</option>
            ))}
          </select>
          {errors.perfilId && <span className="error">{errors.perfilId.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="senha">{isEditing ? 'Nova Senha (opcional)' : 'Senha'}</label>
          <input id="senha" type="password" {...register('senha')} />
          {errors.senha && <span className="error">{errors.senha.message}</span>}
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Usuário Ativo?</label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/settings/usuarios')} className="btn-cancelar">
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

export default UsuarioForm;