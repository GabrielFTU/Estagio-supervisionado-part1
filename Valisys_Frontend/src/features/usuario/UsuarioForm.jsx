import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Mail, Shield, Lock, AlertTriangle } from 'lucide-react'; // Novos ícones

import usuarioService from '../../services/usuarioService.js';
import perfilService from '../../services/perfilService.js';
import useAuthStore from '../../stores/useAuthStore.js'; 
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
  
  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.perfilNome === 'Administrador';

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
    let perfilIdFinal = data.perfilId;
    let ativoFinal = data.ativo;

    // Se não for admin, força os valores originais para evitar envio indevido
    if (isEditing && !isAdmin && usuario) {
        perfilIdFinal = String(usuario.perfilId);
        ativoFinal = usuario.ativo;
    }

    const dataToSend = { 
        ...data, 
        perfilId: perfilIdFinal,
        ativo: ativoFinal
    };
    
    if (isEditing) {
      if (!dataToSend.senha) delete dataToSend.senha;
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingUsuario || isLoadingPerfis;

  if (isEditing && isLoadingUsuario) return <div className="loading-message">Carregando dados do usuário...</div>;
  if (isLoadingPerfis) return <div className="loading-message">Carregando perfis...</div>;
  if (isEditing && !usuario) return <div className="error-message">Usuário não encontrado.</div>;
  
  return (
    <div className="form-container">
      <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            <User size={24} className="text-primary" />
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </h1>
        <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isEditing ? 'Atualize as informações de acesso do usuário.' : 'Cadastre um novo usuário para acessar o sistema.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
                <label htmlFor="nome" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={16} /> NOME COMPLETO <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <input id="nome" {...register('nome')} placeholder="Ex: João da Silva" />
                {errors.nome && <span className="error">{errors.nome.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={16} /> E-MAIL DE ACESSO <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <input id="email" type="email" {...register('email')} placeholder="usuario@empresa.com" />
                {errors.email && <span className="error">{errors.email.message}</span>}
            </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
                <label htmlFor="perfilId" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Shield size={16} /> PERFIL DE ACESSO <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <select 
                    id="perfilId" 
                    {...register('perfilId')} 
                    defaultValue=""
                    disabled={!isAdmin}
                    style={!isAdmin ? { backgroundColor: 'var(--bg-tertiary)', cursor: 'not-allowed', opacity: 0.8 } : {}}
                >
                    <option value="" disabled>Selecione um perfil...</option>
                    {perfis?.map(perfil => (
                    <option key={perfil.id} value={perfil.id}>{perfil.nome}</option>
                    ))}
                </select>
                {errors.perfilId && <span className="error">{errors.perfilId.message}</span>}
                
                {!isAdmin && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', fontSize: '0.8rem', color: '#d97706'}}>
                        <AlertTriangle size={12} />
                        <span>Permissão necessária para alterar o perfil.</span>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="senha" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Lock size={16} /> {isEditing ? 'ALTERAR SENHA (OPCIONAL)' : 'SENHA'} <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <input 
                    id="senha" 
                    type="password" 
                    {...register('senha')} 
                    placeholder={isEditing ? "Deixe em branco para manter a atual" : "••••••••"} 
                />
                {errors.senha && <span className="error">{errors.senha.message}</span>}
            </div>
        </div>

        <div className="form-group-checkbox" style={{
            marginTop: '10px', 
            padding: '15px', 
            backgroundColor: !isAdmin ? 'var(--bg-tertiary)' : 'rgba(34, 197, 94, 0.05)', 
            borderRadius: '8px', 
            border: `1px solid ${!isAdmin ? 'var(--border-color)' : 'rgba(34, 197, 94, 0.2)'}`
        }}>
          <input 
            type="checkbox" 
            id="ativo" 
            {...register('ativo')} 
            disabled={!isAdmin}
            style={{ cursor: !isAdmin ? 'not-allowed' : 'pointer' }}
          />
          <div>
              <label 
                htmlFor="ativo"
                style={{ 
                    color: !isAdmin ? 'var(--text-secondary)' : 'var(--text-primary)', 
                    cursor: !isAdmin ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                }}
              >
                USUÁRIO ATIVO 
              </label>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {isAdmin 
                    ? "Usuários ativos podem acessar o sistema." 
                    : "Apenas administradores podem ativar/inativar usuários."}
              </span>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/settings/usuarios')} 
            className="btn-cancelar"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <X size={18} /> Cancelar
          </button>
          
          <button 
            type="submit" 
            className="btn-salvar" 
            disabled={isPending}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isPending ? 'Salvando...' : <><Save size={18} /> Salvar Usuário</>}
          </button>
        </div>

      </form>
    </div>
  );
}

export default UsuarioForm;