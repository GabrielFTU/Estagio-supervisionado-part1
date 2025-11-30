import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';

import fichaTecnicaService from '../../services/fichaTecnicaService.js';
import produtoService from '../../services/produtoService.js';

import './FichaTecnica.css';

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
  })).min(1, "Adicione pelo menos um componente.")
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
    setValue,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(fichaTecnicaSchema),
    defaultValues: {
      versao: "1.0",
      ativa: true, 
      itens: [{ produtoComponenteId: "", quantidade: 1, perdaPercentual: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "itens" });

  const { data: produtos, isLoading: isLoadingProdutos } = useQuery({
    queryKey: ['produtos', { apenasAtivos: true }],
    queryFn: () => produtoService.getAll({ apenasAtivos: true })
  });

  const { data: ficha, isLoading: isLoadingFicha } = useQuery({
    queryKey: ['fichaTecnica', id],
    queryFn: () => fichaTecnicaService.getById(id),
    enabled: isEditing
  });

  const { data: proximoCodigoData } = useQuery({
    queryKey: ['proximoCodigoFicha'],
    queryFn: () => fichaTecnicaService.getProximoCodigo(),
    enabled: !isEditing
  });

  useEffect(() => {
    if (!isEditing && proximoCodigoData?.codigo) {
      setValue('codigo', proximoCodigoData.codigo);
    }
  }, [proximoCodigoData, isEditing, setValue]);

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

  const produtosPais = produtos?.filter(p => (p.classificacaoId === 2 || p.classificacaoId === 3) && p.ativo) || [];
  const produtosComponentes = produtos?.filter(p => p.classificacaoId !== 3 && p.ativo) || []; 

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
        alert("Erro: Referência Circular identificada.");
        return;
    }
    
    const dataToSend = {
        ...data,
        ativa: isEditing ? data.ativa : true, 
        codigo: data.codigo || null,
        Itens: data.itens 
    };

    if (isEditing) updateMutation.mutate(dataToSend);
    else createMutation.mutate(dataToSend);
  };

  const produtoPaiSelecionado = watch('produtoId');
  const isLoading = isLoadingProdutos || (isEditing && isLoadingFicha);

  if (isLoading) return <div className="loading-message">Carregando...</div>;

  return (
    <div className="form-container" style={{maxWidth: '1000px'}}>
      <h1>{isEditing ? 'Editar Ficha Técnica' : 'NOVA FICHA TÉCNICA'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-section">
            <h3 style={{marginTop: 0, color: 'var(--color-primary)'}}>DADOS GERAIS</h3>
            
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                <div className="form-group" style={{flex: 2, minWidth: '300px'}}>
                    <label>PRODUTO <span style={{color: 'var(--color-danger)'}}>*</span> </label>
                    <select 
                        {...register('produtoId')} 
                        disabled={isEditing} 
                        style={isEditing ? {backgroundColor: 'var(--bg-tertiary)', cursor: 'not-allowed', color: 'var(--text-secondary)'} : {}}
                    >
                        <option value="">Selecione...</option>
                        {produtosPais.map(p => (
                            <option key={p.id} value={p.id}>{p.nome} ({p.codigo})</option>
                        ))}
                    </select>
                    {errors.produtoId && <span className="error">{errors.produtoId.message}</span>}
                </div>

                <div className="form-group" style={{flex: 1}}>
                    <label>CÓDIGO</label>
                    <input 
                        {...register('codigo')} 
                        disabled 
                        style={{backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontWeight: 'bold', opacity: 0.8}}
                        placeholder="Carregando..."
                    />
                    {errors.codigo && <span className="error">{errors.codigo.message}</span>}
                </div>

                <div className="form-group" style={{flex: 1}}>
                    <label>VERSÃO <span style={{color: 'var(--color-danger)'}}>*</span></label>
                    <input {...register('versao')} placeholder="1.0" />
                    {errors.versao && <span className="error">{errors.versao.message}</span>}
                </div>
            </div>

            <div className="form-group">
                <label>DESCRIÇÃO</label>
                <textarea {...register('descricao')} rows={2} />
            </div>

            {isEditing && (
                <div className="form-group-checkbox" style={{marginTop: '15px', padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', border: '1px solid var(--border-color)'}}>
                    <input type="checkbox" id="ativa" {...register('ativa')} />
                    <label htmlFor="ativa" style={{color: 'var(--text-primary)'}}>
                        Ficha Técnica Ativa? (Desmarque para inativar)
                    </label>
                </div>
            )}
        </div>

        <div className="form-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3 style={{margin: 0, color: 'var(--color-primary)'}}>COMPONENTES</h3>
                <button 
                    type="button" 
                    className="btn-new" 
                    onClick={() => append({ produtoComponenteId: "", quantidade: 1, perdaPercentual: 0 })}
                >
                    <Plus size={16} style={{marginRight: '5px'}} /> Adicionar Componente
                </button>
            </div>

            {errors.itens && <div className="error" style={{marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(220, 53, 69, 0.1)', borderRadius: '4px'}}>{errors.itens.message}</div>}

            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{width: '50%'}}>COMPONENTES <span style={{color: 'var(--color-danger)'}}>*</span></th>
                            <th style={{width: '20%'}}>QTD</th>
                            <th style={{width: '20%'}}>PERDA (%)</th>
                            <th style={{width: '10%'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    <select 
                                        {...register(`itens.${index}.produtoComponenteId`)} 
                                        style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                                    >
                                        <option value="">SELECIONE O COMPONENTE...</option>
                                        {produtosComponentes.filter(p => p.id !== produtoPaiSelecionado).map(p => (
                                            <option key={p.id} value={p.id}>{p.nome} ({p.unidadeMedidaSigla})</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        step="0.0001" 
                                        {...register(`itens.${index}.quantidade`)} 
                                        style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}} 
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        {...register(`itens.${index}.perdaPercentual`)} 
                                        style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}} 
                                    />
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn-icon btn-delete" onClick={() => remove(index)} title="Remover componente">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {fields.length === 0 && (
                    <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontStyle: 'italic'}}>
                        Nenhum componente inserido na ficha. Clique em "Adicionar Componente" para iniciar.
                    </div>
                )}
            </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/engenharia/fichas-tecnicas')} className="btn-cancelar">Cancelar</button>
          <button type="submit" className="btn-salvar" disabled={createMutation.isPending || updateMutation.isPending}>
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FichaTecnicaForm;