import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Layers, Hash, FileText, Type, Lock } from 'lucide-react'; 

import categoriaProdutoService from '../../services/categoriaProdutoService.js';
import '../../features/produto/ProdutoForm.css';

const MAX_STRING_LENGTH = 100;

const schema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome da categoria é obrigatório.").max(MAX_STRING_LENGTH),
  codigo: z.string().optional(),
  descricao: z.string().optional(),
});

function CategoriaProdutoForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const basePath = '/settings/cadastros/categorias';
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', codigo: '', descricao: '' }
  });

  const { data: categoria, isLoading: isLoadingCategoria } = useQuery({
    queryKey: ['categoriaProduto', id],
    queryFn: () => categoriaProdutoService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && categoria) {
      reset({
        id: categoria.id,
        nome: categoria.nome,
        codigo: categoria.codigo,
        descricao: categoria.descricao || '', 
      });
    }
  }, [categoria, isEditing, reset]);

  const createMutation = useMutation({
    mutationFn: categoriaProdutoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriasProduto'] });
      navigate(basePath);
    },
    onError: (error) => {
      console.error("Erro ao criar categoria:", error);
      alert(`Falha ao criar: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => categoriaProdutoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriasProduto'] });
      queryClient.invalidateQueries({ queryKey: ['categoriaProduto', id] });
      navigate(basePath);
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao salvar: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
        Id: isEditing ? id : undefined, 
        Nome: data.nome,
        Codigo: isEditing ? data.codigo : undefined,
        Descricao: data.descricao,
        Ativo: isEditing ? (categoria?.ativo ?? true) : true,
    };
    
    if (isEditing) {
      updateMutation.mutate(mappedData);
    } else {
      createMutation.mutate(mappedData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingCategoria;

  if (isEditing && isLoadingCategoria) return <div className="loading-message">Carregando dados...</div>;

  return (
    <div className="form-container">
      <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            <Layers size={24} className="text-primary" />
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
        </h1>
        <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isEditing ? 'Atualize os dados da categoria abaixo.' : 'Preencha os dados para criar uma nova categoria de produtos.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div className="form-group">
                <label htmlFor="codigo" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {isEditing ? <Hash size={16} /> : <Lock size={16} />} Código
                </label>
                <input 
                    id="codigo" 
                    {...register('codigo')} 
                    disabled 
                    placeholder={isEditing ? "" : "Automático"}
                    style={{ 
                        backgroundColor: 'var(--bg-tertiary)', 
                        cursor: 'not-allowed', 
                        color: 'var(--text-secondary)',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                />
                {!isEditing && <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Gerado pelo sistema ao salvar.</small>}
            </div>

            <div className="form-group">
                <label htmlFor="nome" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Type size={16} /> Nome da Categoria
                </label>
                <input 
                    id="nome" 
                    {...register('nome')} 
                    placeholder="Ex: Veículos Pesados, Eletrônicos..." 
                    autoFocus={!isEditing}
                />
                {errors.nome && <span className="error">{errors.nome.message}</span>}
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="descricao" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FileText size={16} /> Descrição
            </label>
            <textarea 
                id="descricao" 
                {...register('descricao')} 
                rows="4" 
                placeholder="Adicione detalhes sobre esta categoria para facilitar a identificação..."
            />
            {errors.descricao && <span className="error">{errors.descricao.message}</span>}
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
            {isPending ? 'Salvando...' : <><Save size={18} /> Salvar Categoria</>}
          </button>
        </div>

      </form>
    </div>
  );
}

export default CategoriaProdutoForm;