import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, X, Package, FileText, Hash, Layers, Ruler, 
  Activity, AlertCircle, Box, Tag, CheckCircle2 
} from 'lucide-react';

import produtoService from '../../services/produtoService.js';
import categoriaProdutoService from '../../services/categoriaProdutoService.js';
import unidadeMedidaService from '../../services/unidadeMedidaService.js';

import './ProdutoForm.css';

// Schema de validação
const produtoSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório (min 3 letras)."),
  descricao: z.string().min(1, "Descrição obrigatória."),
  codigo: z.string().min(1, "Código obrigatório."),
  estoqueMinimo: z.coerce.number().min(0, "Estoque mínimo deve ser positivo."),
  controlarPorLote: z.boolean(),
  ativo: z.boolean(),
  classificacao: z.coerce.number().min(0, "Selecione uma classificação válida."),
  unidadeMedidaId: z.string().min(1, "Selecione uma Unidade de Medida."),
  categoriaProdutoId: z.string().min(1, "Selecione uma Categoria."),
  almoxarifadoEstoqueId: z.string().optional().nullable()
});

const CLASSIFICACAO_OPTIONS = [
  { value: 0, label: 'Matéria Prima' },
  { value: 1, label: 'Componente' },
  { value: 2, label: 'Semi-Acabado' },
  { value: 3, label: 'Produto Acabado' },
  { value: 4, label: 'Material de Consumo' }
];

function ProdutoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      ativo: true,
      controlarPorLote: false,
      estoqueMinimo: 0,
      unidadeMedidaId: "",
      categoriaProdutoId: "",
      codigo: ""
    }
  });

  // Monitorar campos para UX dinâmica (opcional)
  const isAtivo = watch('ativo');

  // Queries de dados
  const { data: produto, isLoading: isLoadingProduto } = useQuery({
    queryKey: ['produto', id],
    queryFn: () => produtoService.getById(id)
  });

  const { data: categorias, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ['categoriasProduto'],
    queryFn: categoriaProdutoService.getAll
  });

  const { data: unidades, isLoading: isLoadingUnidades } = useQuery({
    queryKey: ['unidadesMedida'],
    queryFn: unidadeMedidaService.getAll
  });

  // Preencher formulário ao carregar
  useEffect(() => {
    if (produto) {
      reset({
        ...produto,
        nome: produto.nome || produto.Nome,
        descricao: produto.descricao || produto.Descricao,
        codigo: produto.codigo || produto.CodigoInternoProduto,
        classificacao: Number(produto.classificacaoId ?? produto.classificacao ?? produto.Classificacao),
        unidadeMedidaId: produto.unidadeMedidaId || produto.UnidadeMedidaId || "",
        categoriaProdutoId: produto.categoriaProdutoId || produto.CategoriaProdutoId || "",
        estoqueMinimo: produto.estoqueMinimo ?? 0,
        observacoes: produto.observacoes || "",
        almoxarifadoEstoqueId: produto.almoxarifadoEstoqueId || null,
        controlarPorLote: produto.controlarPorLote ?? false,
        ativo: produto.ativo ?? true
      });
    }
  }, [produto, reset]);

  // Mutação de atualização
  const updateMutation = useMutation({
    mutationFn: (data) => produtoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      queryClient.invalidateQueries({ queryKey: ['produto', id] });
      navigate('/estoque/produtos');
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const mappedData = {
      Id: id,
      ...data, 
      Classificacao: Number(data.classificacao)
    };
    updateMutation.mutate(mappedData);
  };

  const isLoadingGlobal = isLoadingProduto || isLoadingCategorias || isLoadingUnidades;

  if (isLoadingGlobal) return <div className="loading-message">Carregando dados do produto...</div>;

  return (
    <div className="form-container">
      {/* --- Cabeçalho --- */}
      <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '20px', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                <Package size={28} className="text-primary" />
                Editar Produto
            </h1>
            <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Gerencie as informações técnicas e logísticas deste item.
            </p>
        </div>
        <div className={`status-badge ${isAtivo ? 'status-ativo' : 'status-inativo'}`} style={{fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px'}}>
            {isAtivo ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
            {isAtivo ? 'PRODUTO ATIVO' : 'PRODUTO INATIVO'}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        {/* --- Seção 1: Identificação --- */}
        <div className="form-section" style={{backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px'}}>
            <h3 style={{margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                Dados Principais
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>
                <div className="form-group">
                    <label htmlFor="codigo" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Hash size={16} /> CÓDIGO (REF)
                    </label>
                    <input 
                        id="codigo" 
                        {...register('codigo')} 
                        readOnly 
                        className="input-readonly"
                        style={{textAlign: 'center', fontWeight: 'bold', letterSpacing: '0.5px'}}
                    />
                    {errors.codigo && <span className="error">{errors.codigo.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="nome" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Tag size={16} /> NOME DO PRODUTO <span style={{color: 'var(--color-danger)'}}>*</span>
                    </label>
                    <input id="nome" {...register('nome')} placeholder="Ex: Parafuso Sextavado" />
                    {errors.nome && <span className="error">{errors.nome.message}</span>}
                </div>
            </div>

            <div className="form-group" style={{marginTop: '15px'}}>
                <label htmlFor="descricao" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileText size={16} /> DESCRIÇÃO DETALHADA <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <input id="descricao" {...register('descricao')} placeholder="Especificações técnicas..." />
                {errors.descricao && <span className="error">{errors.descricao.message}</span>}
            </div>
        </div>

        {/* --- Seção 2: Classificação e Unidade --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
                <label htmlFor="classificacao" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Activity size={16} /> CLASSIFICAÇÃO <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <select id="classificacao" {...register('classificacao')} className="custom-select">
                    {CLASSIFICACAO_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                {errors.classificacao && <span className="error">{errors.classificacao.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="categoriaProdutoId" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Layers size={16} /> CATEGORIA <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <select id="categoriaProdutoId" {...register('categoriaProdutoId')} className="custom-select">
                    <option value="" disabled>Selecione</option>
                    {categorias?.map(c => (
                        <option key={c.id || c.Id} value={c.id || c.Id}>{c.nome || c.Nome}</option>
                    ))}
                </select>
                {errors.categoriaProdutoId && <span className="error">{errors.categoriaProdutoId.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="unidadeMedidaId" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Ruler size={16} /> UNIDADE <span style={{color: 'var(--color-danger)'}}>*</span>
                </label>
                <select id="unidadeMedidaId" {...register('unidadeMedidaId')} className="custom-select">
                    <option value="" disabled>Selecione</option>
                    {unidades?.map(u => (
                        <option key={u.id || u.Id} value={u.id || u.Id}>
                            {u.nome || u.Nome} ({u.sigla || u.Sigla})
                        </option>
                    ))}
                </select>
                {errors.unidadeMedidaId && <span className="error">{errors.unidadeMedidaId.message}</span>}
            </div>
        </div>

        {/* --- Seção 3: Estoque e Parâmetros --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>
            <div className="form-group">
                <label htmlFor="estoqueMinimo" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Box size={16} /> ESTOQUE MÍNIMO
                </label>
                <input id="estoqueMinimo" type="number" step="0.01" {...register('estoqueMinimo')} />
                {errors.estoqueMinimo && <span className="error">{errors.estoqueMinimo.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="observacoes" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileText size={16} /> OBSERVAÇÕES INTERNAS
                </label>
                <textarea id="observacoes" {...register('observacoes')} rows="1" placeholder="Anotações gerais..." />
            </div>
        </div>

        {/* --- Seção 4: Switches de Controle --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div 
                className="form-group-checkbox" 
                onClick={() => document.getElementById('controlarPorLote').click()}
                style={{cursor: 'pointer', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-primary)'}}
            >
                <input 
                    type="checkbox" 
                    id="controlarPorLote" 
                    {...register('controlarPorLote')} 
                    onClick={(e) => e.stopPropagation()} 
                    style={{width: '20px', height: '20px'}}
                />
                <div>
                    <label htmlFor="controlarPorLote" style={{cursor: 'pointer', display: 'block', marginBottom: '2px'}}>Controle de Rastreabilidade</label>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Exige identificação de lote nas movimentações.</span>
                </div>
            </div>

            <div 
                className="form-group-checkbox" 
                onClick={() => document.getElementById('ativo').click()}
                style={{cursor: 'pointer', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-primary)'}}
            >
                <input 
                    type="checkbox" 
                    id="ativo" 
                    {...register('ativo')} 
                    onClick={(e) => e.stopPropagation()} 
                    style={{width: '20px', height: '20px'}}
                />
                <div>
                    <label htmlFor="ativo" style={{cursor: 'pointer', display: 'block', marginBottom: '2px'}}>Cadastro Ativo</label>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Permite o uso deste produto em novas OPs.</span>
                </div>
            </div>
        </div>

        {/* --- Rodapé de Ações --- */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/estoque/produtos')} 
            className="btn-cancelar"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <X size={18} /> Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-salvar" 
            disabled={isSubmitting || updateMutation.isPending}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {updateMutation.isPending ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProdutoEdit;