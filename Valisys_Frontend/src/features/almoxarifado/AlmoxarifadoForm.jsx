import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Box, MapPin, User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';

import almoxarifadoService from '../../services/almoxarifadoService.js';
import '../../features/produto/ProdutoForm.css';

const MAX_STRING_LENGTH = 100;

const schema = z.object({
  id: z.string().optional(),
  nome: z.string().min(8, "O nome deve ter pelo menos 8 caracteres.").max(150),
  descricao: z.string().min(1, "A descrição é obrigatória.").max(255),
  localizacao: z.string().min(1, "A localização é obrigatória.").max(200),
  responsavel: z.string().min(1, "O responsável é obrigatório.").max(100),
  contato: z.string().max(20, "Máximo 20 caracteres.").optional(),
  email: z.string().email("E-mail inválido.").max(100).optional().or(z.literal('')),
  ativo: z.boolean().default(true),
});

function AlmoxarifadoForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const basePath = '/settings/cadastros/almoxarifados';

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ativo: true, nome: '', descricao: '', localizacao: '', responsavel: '', contato: '', email: '' }
  });

  const { data: almoxarifado, isLoading: isLoadingAlmoxarifado } = useQuery({
    queryKey: ['almoxarifado', id],
    queryFn: () => almoxarifadoService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && almoxarifado) {
      reset({
        id: almoxarifado.id,
        nome: almoxarifado.nome,
        descricao: almoxarifado.descricao || '', 
        localizacao: almoxarifado.localizacao || '',
        responsavel: almoxarifado.responsavel || '',
        contato: almoxarifado.contato || '',
        email: almoxarifado.email || '',
        ativo: almoxarifado.ativo ?? true,
      });
    }
  }, [almoxarifado, isEditing, reset]);

  const createMutation = useMutation({
    mutationFn: almoxarifadoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['almoxarifados'] });
      navigate(basePath);
    },
    onError: (error) => {
      console.error("Erro ao criar almoxarifado:", error);
      alert(`Falha ao criar: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => almoxarifadoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['almoxarifados'] });
      queryClient.invalidateQueries({ queryKey: ['almoxarifado', id] });
      navigate(basePath);
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const statusFinal = (isEditing && almoxarifado && !almoxarifado.ativo) ? data.ativo : true;

    const mappedData = {
        Id: isEditing ? id : undefined,
        Nome: data.nome,
        Descricao: data.descricao,
        Localizacao: data.localizacao,
        Responsavel: data.responsavel,
        Contato: data.contato || null, 
        Email: data.email || null,
        Ativo: statusFinal
    };

    if (isEditing) {
      updateMutation.mutate(mappedData);
    } else {
      createMutation.mutate(mappedData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingAlmoxarifado;

  if (isEditing && isLoadingAlmoxarifado) return <div className="loading-message">Carregando dados...</div>;

  return (
    <div className="form-container">
      <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            <Box size={24} className="text-primary" />
            {isEditing ? 'Editar Almoxarifado' : 'Novo Almoxarifado'}
        </h1>
        <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gerencie os locais de armazenamento de materiais e produtos.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
                <label htmlFor="nome" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Box size={16} /> NOME DO LOCAL <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <input id="nome" {...register('nome')} placeholder="Ex: Almoxarifado Central" autoFocus />
                {errors.nome && <span className="error">{errors.nome.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="localizacao" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={16} /> LOCALIZAÇÃO <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <input id="localizacao" {...register('localizacao')} placeholder="Ex: Galpão B, Corredor 3" />
                {errors.localizacao && <span className="error">{errors.localizacao.message}</span>}
            </div>
        </div>
        
        <div className="form-group">
            <label htmlFor="descricao" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FileText size={16} /> DESCRIÇÃO <span style={{color: 'var(--color-danger)'}}>*</span></label>
            <input id="descricao" {...register('descricao')} placeholder="Detalhes sobre este local..." />
            {errors.descricao && <span className="error">{errors.descricao.message}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="form-group">
                <label htmlFor="responsavel" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={16} /> RESPONSÁVEL <span style={{color: 'var(--color-danger)'}}>*</span> </label>
                <input id="responsavel" {...register('responsavel')} placeholder="Nome do encarregado" />
                {errors.responsavel && <span className="error">{errors.responsavel.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="contato" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={16} /> TELEFONE
                </label>
                <input id="contato" {...register('contato')} placeholder="(00) 00000-0000" />
                {errors.contato && <span className="error">{errors.contato.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={16} /> E-MAIL
                </label>
                <input id="email" type="email" {...register('email')} placeholder="setor@empresa.com" />
                {errors.email && <span className="error">{errors.email.message}</span>}
            </div>
        </div>

        {isEditing && almoxarifado && !almoxarifado.ativo && (
            <div className="form-group-checkbox" style={{
                marginTop: '15px', 
                padding: '12px', 
                backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                borderRadius: '6px', 
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <AlertCircle size={20} color="#d97706" />
                <div>
                    <span style={{display: 'block', fontSize: '0.85rem', color: '#d97706', fontWeight: 'bold', marginBottom: '4px'}}>
                        Este almoxarifado está inativo.
                    </span>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input type="checkbox" id="ativo" {...register('ativo')} style={{width: '16px', height: '16px', cursor: 'pointer'}} />
                        <label htmlFor="ativo" style={{color: 'var(--text-primary)', cursor: 'pointer', margin: 0}}>
                            Deseja reativar este local?
                        </label>
                    </div>
                </div>
            </div>
        )}
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate(basePath)} 
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
            {isPending ? 'Salvando...' : <><Save size={18} /> Salvar</>}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AlmoxarifadoForm;