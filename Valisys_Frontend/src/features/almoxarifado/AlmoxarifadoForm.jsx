import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import almoxarifadoService from '../../services/almoxarifadoService.js';
import '../../features/produto/ProdutoForm.css';

const MAX_STRING_LENGTH = 100; 

const baseSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome é obrigatório.").max(150, "Máximo 150 caracteres."),
  descricao: z.string().max(255, "Máximo 255 caracteres.").optional(),
  localizacao: z.string().min(1, "A localização é obrigatória.").max(MAX_STRING_LENGTH, `Máximo ${MAX_STRING_LENGTH} caracteres.`),
  responsavel: z.string().min(1, "O responsável é obrigatório.").max(MAX_STRING_LENGTH, `Máximo ${MAX_STRING_LENGTH} caracteres.`),
  contato: z.string().max(20, "Máximo 20 caracteres.").optional(),
  email: z.string().email("E-mail inválido.").max(MAX_STRING_LENGTH, `Máximo ${MAX_STRING_LENGTH} caracteres.`).optional(),
  ativo: z.boolean().default(true),
});

const createSchema = baseSchema.extend({
  email: z.string().email("E-mail inválido.").max(MAX_STRING_LENGTH).optional(),
});

const updateSchema = z.object({
    id: z.string().uuid(),
    nome: z.string().min(1, "O nome é obrigatório.").max(MAX_STRING_LENGTH, `Máximo ${MAX_STRING_LENGTH} caracteres.`),
    localizacao: z.string().max(200, "Máximo 200 caracteres.").optional(),
    ativo: z.boolean().default(true),
});


function AlmoxarifadoForm() {
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
    resolver: zodResolver(schema),
    defaultValues: isEditing ? {} : { ativo: true, nome: '', descricao: '', localizacao: '', responsavel: '', contato: '', email: '' }
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
      navigate('/settings/cadastros/almoxarifados');
    },
    onError: (error) => {
      console.error("Erro ao criar almoxarifado:", error);
      alert(`Falha ao criar o almoxarifado: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => almoxarifadoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['almoxarifados'] });
      queryClient.invalidateQueries({ queryKey: ['almoxarifado', id] });
      navigate('/settings/cadastros/almoxarifados');
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar almoxarifado: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
            mappedData[pascalKey] = data[key];
        }
    }

    if (isEditing) {
      updateMutation.mutate(mappedData);
    } else {
      createMutation.mutate(mappedData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingAlmoxarifado;

  if (isEditing && isLoadingAlmoxarifado) return <div className="loading-message">Carregando almoxarifado...</div>;

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Almoxarifado' : 'Adicionar Novo Almoxarifado'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>
        
        {/* Apenas no modo de Criação, os campos são necessários pelo CreateDTO */}
        {!isEditing && (
            <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <input id="descricao" {...register('descricao')} />
                {errors.descricao && <span className="error">{errors.descricao.message}</span>}
            </div>
        )}

        <div className="form-group">
          <label htmlFor="localizacao">Localização</label>
          <input id="localizacao" {...register('localizacao')} />
          {errors.localizacao && <span className="error">{errors.localizacao.message}</span>}
        </div>

        {!isEditing && (
            <div className="form-group">
                <label htmlFor="responsavel">Responsável</label>
                <input id="responsavel" {...register('responsavel')} />
                {errors.responsavel && <span className="error">{errors.responsavel.message}</span>}
            </div>
        )}

        {!isEditing && (
            <div className="form-group">
                <label htmlFor="contato">Contato</label>
                <input id="contato" {...register('contato')} />
                {errors.contato && <span className="error">{errors.contato.message}</span>}
            </div>
        )}

        {!isEditing && (
            <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" {...register('email')} />
                {errors.email && <span className="error">{errors.email.message}</span>}
            </div>
        )}

        <div className="form-group-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Almoxarifado Ativo?</label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/settings/cadastros/almoxarifados')} className="btn-cancelar">
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

export default AlmoxarifadoForm;