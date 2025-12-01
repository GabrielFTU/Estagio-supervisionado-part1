import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Layers, Hash, Type, FileText } from 'lucide-react';
import tipoOrdemDeProducaoService from '../../services/tipoOrdemDeProducaoService.js';
import '../../features/produto/ProdutoForm.css';

const MAX_STRING_LENGTH = 100;
const MAX_CODE_LENGTH = 10;

const tipoOrdemDeProducaoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome é obrigatório.").max(MAX_STRING_LENGTH),
  codigo: z.string().min(1, "O código é obrigatório.").max(MAX_CODE_LENGTH),
  descricao: z.string().max(500, "Máximo 500 caracteres.").optional(),
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
    defaultValues: { ativo: true, nome: '', codigo: '', descricao: '' }
  });

  const { data: tipoOrdem, isLoading } = useQuery({
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
        descricao: tipoOrdem.descricao || '',
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
      alert(`Falha ao criar: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => tipoOrdemDeProducaoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposOrdemDeProducao'] });
      navigate(basePath);
    },
    onError: (err) => {
      alert(`Erro ao atualizar: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
        Id: isEditing ? id : undefined, 
        Nome: data.nome,
        Codigo: data.codigo.toUpperCase(), 
        Descricao: data.descricao,
        Ativo: data.ativo,
    };
    
    if (isEditing) updateMutation.mutate(mappedData);
    else createMutation.mutate(mappedData);
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoading;

  if (isLoading) return <div className="loading-message">Carregando...</div>;

  return (
    <div className="form-container">
      <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '20px', paddingBottom: '10px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
              <Layers size={24} className="text-primary" />
              {isEditing ? 'Editar Tipo de O.P.' : 'Novo Tipo de O.P.'}
          </h1>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Defina as classificações para suas Ordens de Produção (Ex: Normal, Retrabalho, Protótipo).
          </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div className="form-group">
                <label htmlFor="nome" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Type size={16} /> NOME DO TIPO <span style={{color: 'var(--color-danger)'}}>*</span></label>
                <input 
                    id="nome" 
                    {...register('nome')} 
                    placeholder="Ex: Produção Normal" 
                    autoFocus 
                />
                {errors.nome && <span className="error">{errors.nome.message}</span>}
            </div>
            
            <div className="form-group">
                <label htmlFor="codigo" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Hash size={16} /> CODIGO (SIGLA) <span style={{color: 'var(--color-danger)'}}>*</span></label>
                <input 
                    id="codigo" 
                    {...register('codigo')} 
                    placeholder="Ex: NOR"
                    style={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}
                    maxLength={10}
                />
                {errors.codigo && <span className="error">{errors.codigo.message}</span>}
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="descricao" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FileText size={16} /> DESCRIÇÃO
            </label>
            <textarea 
                id="descricao" 
                {...register('descricao')} 
                rows="3" 
                placeholder="Descreva quando este tipo de ordem deve ser utilizado..."
            />
            {errors.descricao && <span className="error">{errors.descricao.message}</span>}
        </div>

        <div className="form-group-checkbox" style={{ marginTop: '10px', padding: '15px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo" style={{ fontWeight: 500, cursor: 'pointer' }}>
              TIPO DE ORDEM ATIVA?
              <br/>
              <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                  Desmarcar impedirá a criação de novas O.Ps com este tipo.
              </span>
          </label>
        </div>
        
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

export default TipoOrdemDeProducaoForm;