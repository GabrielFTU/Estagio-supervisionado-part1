import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';

import fichaTecnicaService from '../../services/fichaTecnicaService.js';
import produtoService from '../../services/produtoService.js';

import '../../features/produto/ProdutoForm.css';

const fichaTecnicaSchema = z.object({
  id: z.string().optional(),
  produtoId: z.string().min(1, "Selecione o Produto Pai."),
  codigo: z.string().min(1, "O código é obrigatório."),
  versao: z.string().min(1, "A versão é obrigatória."),
  descricao: z.string().optional(),
  ativa: z.boolean().default(true),
  itens: z.array(z.object({
    produtoComponenteId: z.string().min(1, "Selecione um componente."),
    quantidade: z.coerce.number().min(0.0001, "Qtd deve ser maior que zero."),
    perdaPercentual: z.coerce.number().min(0).default(0)
  })).min(1, "Adicione pelo menos um componente à ficha.")
});

function FichaTecnicaForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    register, 
    control,
    handleSubmit, 
    watch,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(fichaTecnicaSchema),
    defaultValues: {
      versao: "1.0",
      ativa: true,
      itens: [{ produtoComponenteId: "", quantidade: 1, perdaPercentual: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens"
  });

  const { data: produtos, isLoading: isLoadingProdutos } = useQuery({
    queryKey: ['produtos'],
    queryFn: produtoService.getAll
  });

  const { data: ficha, isLoading: isLoadingFicha } = useQuery({
    queryKey: ['fichaTecnica', id],
    queryFn: () => fichaTecnicaService.getById(id),
    enabled: isEditing
  });

  useEffect(() => {
    if (isEditing && ficha) {
      reset({
        id: ficha.id,
        produtoId: ficha.produtoId,
        codigo: ficha.codigo,
        versao: ficha.versao,
        descricao: ficha.descricao || "",
        ativa: ficha.ativa,
        itens: ficha.itens.map(item => ({
            produtoComponenteId: item.produtoComponenteId,
            quantidade: item.quantidade,
            perdaPercentual: item.perdaPercentual
        }))
      });
    }
  }, [isEditing, ficha, reset]);

  const produtosPais = produtos?.filter(p => p.classificacaoId === 2 || p.classificacaoId === 3) || [];
  const produtosComponentes = produtos?.filter(p => p.classificacaoId !== 3) || []; 

  const createMutation = useMutation({
    mutationFn: fichaTecnicaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fichasTecnicas'] });
      navigate('/engenharia/fichas-tecnicas');
    },
    onError: (error) => alert(`Erro: ${error.response?.data?.message || error.message}`)
  });

  const updateMutation = useMutation({
    mutationFn: (data) => fichaTecnicaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fichasTecnicas'] });
      navigate('/engenharia/fichas-tecnicas');
    },
    onError: (error) => alert(`Erro: ${error.response?.data?.message || error.message}`)
  });

  const onSubmit = (data) => {
    if (data.itens.some(i => i.produtoComponenteId === data.produtoId)) {
        alert("Erro: O Produto Pai não pode ser um componente dele mesmo.");
        return;
    }

    const dataToSend = {
        ...data,
        Itens: data.itens 
    };

    if (isEditing) {
        updateMutation.mutate(dataToSend);
    } else {
        createMutation.mutate(dataToSend);
    }
  };

  const produtoPaiSelecionado = watch('produtoId');
  const isLoading = isLoadingProdutos || (isEditing && isLoadingFicha);

  if (isLoading) return <div className="loading-message">Carregando...</div>;

  return (
    <div className="form-container" style={{maxWidth: '1000px'}}>
      <h1>{isEditing ? 'Editar Ficha Técnica' : 'Nova Ficha Técnica'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-section" style={{marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)'}}>
            <h3 style={{marginTop: 0, color: 'var(--color-primary)'}}>Dados Gerais</h3>
            
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                <div className="form-group" style={{flex: 2, minWidth: '300px'}}>
                    <label>Produto (Pai)</label>
                    <select {...register('produtoId')} disabled={isEditing} style={isEditing ? {backgroundColor: '#f0f0f0', cursor: 'not-allowed'} : {}}>
                        <option value="">Selecione...</option>
                        {produtosPais.map(p => (
                            <option key={p.id} value={p.id}>{p.nome} ({p.codigo})</option>
                        ))}
                    </select>
                    {errors.produtoId && <span className="error">{errors.produtoId.message}</span>}
                </div>

                <div className="form-group" style={{flex: 1}}>
                    <label>Código</label>
                    <input {...register('codigo')} />
                    {errors.codigo && <span className="error">{errors.codigo.message}</span>}
                </div>

                <div className="form-group" style={{flex: 1}}>
                    <label>Versão</label>
                    <input {...register('versao')} />
                    {errors.versao && <span className="error">{errors.versao.message}</span>}
                </div>
            </div>

            <div className="form-group">
                <label>Descrição</label>
                <textarea {...register('descricao')} rows={2} />
            </div>

            <div className="form-group-checkbox">
                <input type="checkbox" id="ativa" {...register('ativa')} />
                <label htmlFor="ativa">Ficha Ativa?</label>
            </div>
        </div>

        <div className="form-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3 style={{margin: 0, color: 'var(--color-primary)'}}>Componentes</h3>
                <button 
                    type="button" 
                    className="btn-new" 
                    onClick={() => append({ produtoComponenteId: "", quantidade: 1, perdaPercentual: 0 })}
                    style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}
                >
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <Plus size={16} /> 
                        <span>Item</span>
                    </div>
                </button>
            </div>

            {errors.itens && <div className="error" style={{marginBottom: '10px'}}>{errors.itens.message}</div>}

            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{width: '50%'}}>Componente</th>
                            <th style={{width: '20%'}}>Quantidade</th>
                            <th style={{width: '20%'}}>Perda (%)</th>
                            <th style={{width: '10%'}}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    <select 
                                        {...register(`itens.${index}.produtoComponenteId`)} 
                                        style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                                    >
                                        <option value="">Selecione...</option>
                                        {produtosComponentes
                                            .filter(p => p.id !== produtoPaiSelecionado)
                                            .map(p => (
                                            <option key={p.id} value={p.id}>{p.nome} ({p.unidadeMedidaSigla})</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input type="number" step="0.0001" {...register(`itens.${index}.quantidade`)} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
                                </td>
                                <td>
                                    <input type="number" step="0.1" {...register(`itens.${index}.perdaPercentual`)} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn-icon btn-delete" onClick={() => remove(index)}><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/engenharia/fichas-tecnicas')} className="btn-cancelar">Cancelar</button>
          <button type="submit" className="btn-salvar" disabled={createMutation.isPending || updateMutation.isPending}>
            {(createMutation.isPending || updateMutation.isPending) ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FichaTecnicaForm;