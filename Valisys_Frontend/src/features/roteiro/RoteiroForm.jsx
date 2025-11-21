import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';

import roteiroProducaoService from '../../services/roteiroProducaoService.js';
import produtoService from '../../services/produtoService.js';
import faseProducaoService from '../../services/faseProducaoService.js';

import '../../features/produto/ProdutoForm.css';

const roteiroSchema = z.object({
  id: z.string().optional(),
  produtoId: z.string().min(1, "Selecione o Produto."),
  codigo: z.string().min(1, "O código é obrigatório."),
  versao: z.string().min(1, "A versão é obrigatória."),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
  etapas: z.array(z.object({
    faseProducaoId: z.string().min(1, "Selecione a fase."),
    ordem: z.coerce.number().min(1, "Ordem inválida."),
    tempoDias: z.coerce.number().min(0, "Tempo não pode ser negativo."),
    instrucoes: z.string().optional()
  })).min(1, "Adicione pelo menos uma etapa.")
});

function RoteiroForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(roteiroSchema),
    defaultValues: { versao: "1.0", ativo: true, etapas: [{ faseProducaoId: "", ordem: 1, tempoDias: 0 }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "etapas" });

  const { data: produtos } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll });
  const { data: fases } = useQuery({ queryKey: ['fasesProducao'], queryFn: faseProducaoService.getAll });
  const { data: roteiro } = useQuery({
    queryKey: ['roteiroProducao', id],
    queryFn: () => roteiroProducaoService.getById(id),
    enabled: isEditing
  });

  useEffect(() => {
    if (isEditing && roteiro) {
      reset({ ...roteiro, etapas: roteiro.etapas.sort((a, b) => a.ordem - b.ordem) });
    }
  }, [isEditing, roteiro, reset]);

  // Lógica Inteligente: Quando selecionar uma fase, puxar o tempo padrão dela
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
    onError: (error) => alert(`Erro: ${error.response?.data?.message || error.message}`)
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="form-container" style={{maxWidth: '1000px'}}>
      <h1>{isEditing ? 'Editar Roteiro' : 'Novo Roteiro de Produção'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        {/* Cabeçalho */}
        <div className="form-section" style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px'}}>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                <div className="form-group" style={{flex: 2}}>
                    <label>Produto</label>
                    <select {...register('produtoId')} disabled={isEditing}>
                        <option value="">Selecione...</option>
                        {produtos?.filter(p => p.classificacaoId === 2 || p.classificacaoId === 3).map(p => (
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
                </div>
            </div>
            <div className="form-group">
                <label>Descrição</label>
                <textarea {...register('descricao')} rows={2} />
            </div>
            <div className="form-group-checkbox">
                <input type="checkbox" id="ativo" {...register('ativo')} />
                <label htmlFor="ativo">Ativo?</label>
            </div>
        </div>

        {/* Etapas */}
        <div className="form-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                <h3>Etapas do Processo</h3>
                <button type="button" className="btn-new" onClick={() => append({ faseProducaoId: "", ordem: fields.length + 1, tempoDias: 0 })} style={{fontSize: '0.8rem', padding: '5px 10px'}}>
                    <Plus size={16} style={{marginRight: 5}} /> Adicionar
                </button>
            </div>
            {errors.etapas && <div className="error">{errors.etapas.message}</div>}

            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{width: '60px'}}>Ord.</th>
                            <th>Fase</th>
                            <th style={{width: '100px'}}>Dias</th>
                            <th>Instruções</th>
                            <th style={{width: '50px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((item, index) => (
                            <tr key={item.id}>
                                <td><input type="number" {...register(`etapas.${index}.ordem`)} style={{width: '100%', padding: '5px'}} /></td>
                                <td>
                                    <select 
                                        {...register(`etapas.${index}.faseProducaoId`)} 
                                        onChange={(e) => {
                                            register(`etapas.${index}.faseProducaoId`).onChange(e);
                                            handleFaseChange(index, e.target.value); // Auto-preenche dias
                                        }}
                                        style={{width: '100%', padding: '5px'}}
                                    >
                                        <option value="">Selecione...</option>
                                        {fases?.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                                    </select>
                                </td>
                                <td><input type="number" {...register(`etapas.${index}.tempoDias`)} style={{width: '100%', padding: '5px'}} /></td>
                                <td><input type="text" {...register(`etapas.${index}.instrucoes`)} style={{width: '100%', padding: '5px'}} /></td>
                                <td><button type="button" className="btn-icon btn-delete" onClick={() => remove(index)}><Trash2 size={16} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="form-actions">
            <button type="button" onClick={() => navigate('/engenharia/roteiros')} className="btn-cancelar">Cancelar</button>
            <button type="submit" className="btn-salvar" disabled={mutation.isPending}><Save size={18} style={{marginRight: 5}} /> Salvar</button>
        </div>
      </form>
    </div>
  );
}

export default RoteiroForm;