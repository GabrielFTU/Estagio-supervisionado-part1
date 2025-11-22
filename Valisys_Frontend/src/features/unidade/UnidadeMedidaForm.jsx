import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Ruler, Save, X, Scale, Calculator } from 'lucide-react'; 
import unidadeMedidaService from '../../services/unidadeMedidaService.js';
import '../../features/produto/ProdutoForm.css';

const unidadeMedidaSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome é obrigatório.").max(50),
  sigla: z.string().min(1, "A sigla é obrigatória.").max(10),
  grandeza: z.coerce.number().min(0, "Selecione uma grandeza."),
  fatorConversao: z.coerce.number().min(0.000001, "O fator deve ser maior que zero."),
  ehUnidadeBase: z.boolean().default(false)
});

const GRANDEZAS = [
  { value: 0, label: 'Unidade (Contagem)' },
  { value: 1, label: 'Massa (Peso)' },
  { value: 2, label: 'Comprimento' },
  { value: 3, label: 'Volume' },
  { value: 4, label: 'Tempo' },
  { value: 5, label: 'Área' },
];

function UnidadeMedidaForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const basePath = '/settings/cadastros/unidades';
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(unidadeMedidaSchema),
    defaultValues: { nome: '', sigla: '', grandeza: 0, fatorConversao: 1, ehUnidadeBase: false }
  });

  const { data: unidade, isLoading } = useQuery({
    queryKey: ['unidadeMedida', id],
    queryFn: () => unidadeMedidaService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && unidade) {
      reset({
        id: unidade.id,
        nome: unidade.nome,
        sigla: unidade.sigla,
        grandeza: unidade.grandeza,
        fatorConversao: unidade.fatorConversao,
        ehUnidadeBase: unidade.ehUnidadeBase
      });
    }
  }, [unidade, isEditing, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? unidadeMedidaService.update(id, data) : unidadeMedidaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidadesMedida'] });
      navigate(basePath);
    },
    onError: (err) => alert(`Erro: ${err.response?.data?.message || err.message}`)
  });

  const onSubmit = (data) => {
      const dataToSend = {
          Id: isEditing ? id : undefined,
          Nome: data.nome,
          Sigla: data.sigla,
          Grandeza: Number(data.grandeza),
          FatorConversao: Number(data.fatorConversao),
          EhUnidadeBase: data.ehUnidadeBase
      };
      mutation.mutate(dataToSend);
  };

  if (isEditing && isLoading) return <div className="loading-message">Carregando...</div>;

  const ehBase = watch('ehUnidadeBase');

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Unidade de Medida' : 'Nova Unidade de Medida'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Ruler size={16}/> Nome</label>
                <input {...register('nome')} placeholder="Ex: Grama" />
                {errors.nome && <span className="error">{errors.nome.message}</span>}
            </div>
            
            <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Sigla</label>
                <input {...register('sigla')} placeholder="Ex: G" style={{textAlign: 'center', fontWeight: 'bold'}}/>
                {errors.sigla && <span className="error">{errors.sigla.message}</span>}
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Scale size={16}/> Tipo de Grandeza</label>
                <select {...register('grandeza')}>
                    {GRANDEZAS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
            </div>

            <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calculator size={16}/> Fator de Conversão</label>
                <input 
                    type="number" step="0.000001" 
                    {...register('fatorConversao')} 
                    disabled={ehBase} 
                    style={ehBase ? {backgroundColor: '#e5e7eb'} : {}}
                />
                <small style={{color: '#666'}}>Ex: 1 para base, 0.001 para mili...</small>
            </div>
        </div>

        <div className="form-group-checkbox" style={{backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px'}}>
          <input type="checkbox" id="ehUnidadeBase" {...register('ehUnidadeBase')} />
          <label htmlFor="ehUnidadeBase">
              Esta é a <strong>Unidade Base</strong> (Padrão) para esta grandeza?
              <br/>
              <span style={{fontSize: '0.8rem', fontWeight: 'normal'}}>
                  (Ex: Marque se for KG para Massa ou Metro para Comprimento)
              </span>
          </label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate(basePath)} className="btn-cancelar">
            <X size={18} /> Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando...' : <><Save size={18} /> Salvar</>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UnidadeMedidaForm;