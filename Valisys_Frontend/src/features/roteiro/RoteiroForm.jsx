import React, { useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, Clock, ArrowUp, ArrowDown, GripVertical, AlertCircle } from 'lucide-react'; 

import roteiroProducaoService from '../../services/roteiroProducaoService.js';
import produtoService from '../../services/produtoService.js';
import faseProducaoService from '../../services/faseProducaoService.js';

import '../../features/produto/ProdutoForm.css';
import './RoteiroForm.css'; 

const roteiroSchema = z.object({
  id: z.string().optional(),
  produtoId: z.string().min(1, "Selecione o Produto."),
  codigo: z.string().min(1, "O código é obrigatório."),
  versao: z.string().min(1, "A versão é obrigatória."),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
  etapas: z.array(z.object({
    faseProducaoId: z.string().min(1, "Selecione a fase."),
    ordem: z.coerce.number().min(1),
    tempoDias: z.coerce.number().min(0, "Tempo inválido."),
    instrucoes: z.string().optional()
  })).min(1, "O roteiro deve conter pelo menos uma etapa.")
});

function RoteiroForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const defaultCodigo = isEditing ? '' : `RASCUNHO-${Date.now().toString().slice(-6)}`;

  const { 
    register, control, handleSubmit, reset, watch, setValue, getValues, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(roteiroSchema),
    defaultValues: { 
        versao: "1.0", 
        ativo: true, 
        etapas: [{ faseProducaoId: "", ordem: 1, tempoDias: 0 }],
        codigo: defaultCodigo
    }
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: "etapas" });

  const etapasAssistidas = watch('etapas');
  const tempoTotalProducao = etapasAssistidas?.reduce((acc, etapa) => acc + (Number(etapa.tempoDias) || 0), 0) || 0;

  const { data: produtos } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll });
  const { data: fases } = useQuery({ queryKey: ['fasesProducao'], queryFn: faseProducaoService.getAll });
  const { data: roteiro } = useQuery({
    queryKey: ['roteiroProducao', id],
    queryFn: () => roteiroProducaoService.getById(id),
    enabled: isEditing
  });

  const updateOrdemSequencial = useCallback(() => {
    const currentEtapas = getValues('etapas'); 
    const needsUpdate = currentEtapas.some((item, index) => Number(item.ordem) !== index + 1);

    if (needsUpdate) { 
        const newEtapas = currentEtapas.map((item, index) => ({ ...item, ordem: index + 1 }));
        setValue('etapas', newEtapas, { shouldValidate: true }); 
    }
  }, [getValues, setValue]); 

  useEffect(() => {
      if (isEditing && roteiro) {
        reset({ 
            ...roteiro, 
            codigo: roteiro.codigo, 
            etapas: roteiro.etapas.sort((a, b) => a.ordem - b.ordem) 
        });
      }
  }, [isEditing, roteiro, reset]);
  
  useEffect(() => {
    updateOrdemSequencial();
  }, [fields.length, updateOrdemSequencial]); 

  const handleMoveEtapa = (fromIndex, toIndex) => {
    move(fromIndex, toIndex);
  };
  
  const handleFaseChange = (index, faseId) => {
    const faseSelecionada = fases?.find(f => f.id === faseId);
    if (faseSelecionada) {
        setValue(`etapas.${index}.tempoDias`, faseSelecionada.tempoPadraoDias);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? roteiroProducaoService.update(id, data) : roteiroProducaoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roteirosProducao'] });
      navigate('/engenharia/roteiros');
    },
    onError: (error) => {
        const msg = error.response?.data?.message || error.message;
        alert(`Erro ao salvar: ${msg}`);
    }
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="form-container full-width">
      <div className="form-header-title">
        <h1>{isEditing ? 'Editar Roteiro de Produção' : 'Novo Roteiro de Produção'}</h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="roteiro-form-wrapper">
        
        <div className="card-section">
            <h3 className="section-title">Informações Gerais</h3>
            <div className="grid-layout">
                <div className="form-group span-2">
                    <label>Produto Base <span style={{color: 'var(--color-danger)'}}>*</span></label>
                    <select {...register('produtoId')} disabled={isEditing} className={errors.produtoId ? 'input-error' : ''}>
                        <option value="">Selecione o produto...</option>
                        {produtos?.filter(p => p.classificacaoId === 2 || p.classificacaoId === 3).map(p => (
                            <option key={p.id} value={p.id}>{p.nome} ({p.codigo})</option>
                        ))}
                    </select>
                    {errors.produtoId && <span className="error-msg">{errors.produtoId.message}</span>}
                </div>
                <div className="form-group">
                    <label>Código do Roteiro</label>
                    <input {...register('codigo')} readOnly className="input-readonly" />
                    {errors.codigo && <span className="error-msg">{errors.codigo.message}</span>}
                </div>
                <div className="form-group">
                    <label>Versão</label>
                    <input {...register('versao')} placeholder="1.0" className={errors.versao ? 'input-error' : ''}/>
                    {errors.versao && <span className="error-msg">{errors.versao.message}</span>}
                </div>
                <div className="form-group span-3">
                    <label>Descrição</label>
                    <input {...register('descricao')} placeholder="Descrição detalhada do processo..." />
                </div>
                <div className="form-group-checkbox">
                    <input type="checkbox" id="ativo" {...register('ativo')} />
                    <label htmlFor="ativo">Roteiro Ativo</label>
                </div>
            </div>
        </div>

        <div className="card-section">
            <div className="section-header">
                <h3>Sequência Operacional <span style={{color: 'var(--color-danger)'}}>*</span></h3>
                <button type="button" className="btn-new-small" onClick={() => append({ faseProducaoId: "", ordem: fields.length + 1, tempoDias: 0 })}>
                    <Plus size={16} /> Adicionar Etapa
                </button>
            </div>
            
            {errors.etapas && <div className="alert-box error"><AlertCircle size={16}/> {errors.etapas.message}</div>}

            <div className="table-container">
                <table className="roteiro-table">
                    <thead>
                        <tr>
                            <th width="40"></th>
                            <th width="60">Ord.</th>
                            <th>Fase de Produção</th>
                            <th width="100">Dias</th>
                            <th>Instruções Específicas</th>
                            <th width="100">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((item, index) => (
                            <tr key={item.id}>
                                <td className="grip-col"><GripVertical size={16} color="#9ca3af" /></td>
                                <td>
                                    <input 
                                        type="number" 
                                        {...register(`etapas.${index}.ordem`)} 
                                        readOnly 
                                        className="input-plain text-center" 
                                    />
                                </td>
                                <td>
                                    <select 
                                        {...register(`etapas.${index}.faseProducaoId`)} 
                                        onChange={(e) => {
                                            register(`etapas.${index}.faseProducaoId`).onChange(e);
                                            handleFaseChange(index, e.target.value); 
                                        }}
                                        className={errors.etapas?.[index]?.faseProducaoId ? 'input-error' : ''}
                                    >
                                        <option value="">Selecione...</option>
                                        {fases?.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        step="1" 
                                        {...register(`etapas.${index}.tempoDias`, { valueAsNumber: true })} 
                                        className={errors.etapas?.[index]?.tempoDias ? 'input-error' : ''}
                                    />
                                </td>
                                <td>
                                    <input type="text" {...register(`etapas.${index}.instrucoes`)} placeholder="Opcional..." />
                                </td>
                                <td className='actions-col'>
                                    <div className="action-group">
                                        <button type="button" className="btn-icon-mini" onClick={() => handleMoveEtapa(index, index - 1)} disabled={index === 0}>
                                            <ArrowUp size={14} />
                                        </button>
                                        <button type="button" className="btn-icon-mini" onClick={() => handleMoveEtapa(index, index + 1)} disabled={index === fields.length - 1}>
                                            <ArrowDown size={14} />
                                        </button>
                                        <button type="button" className="btn-icon-mini danger" onClick={() => remove(index)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {fields.length === 0 && (
                            <tr>
                                <td colSpan="6" className="empty-row">Nenhuma etapa adicionada ao roteiro.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="summary-bar">
                <div className="summary-item">
                    <Clock size={20} />
                    <span>Lead Time Total:</span>
                    <strong>{tempoTotalProducao} dias</strong>
                </div>
                <div className="summary-item">
                    <span>Total de Etapas:</span>
                    <strong>{fields.length}</strong>
                </div>
            </div>
        </div>

        <div className="form-footer">
            <button type="button" onClick={() => navigate('/engenharia/roteiros')} className="btn-cancelar">Cancelar</button>
            <button type="submit" className="btn-salvar" disabled={mutation.isPending || isSubmitting}>
                {(mutation.isPending || isSubmitting) ? 'Salvando...' : <><Save size={18} /> Salvar Roteiro</>}
            </button>
        </div>
      </form>
    </div>
  );
}

export default RoteiroForm;