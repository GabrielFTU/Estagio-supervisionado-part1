import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, AlertCircle, CheckCircle, X } from 'lucide-react'; 
import axios from 'axios'; 

import fornecedorService from '../../services/fornecedorService.js';
import '../../features/produto/ProdutoForm.css';

const cleanAndValidate = (doc) => (doc || '').replace(/[^\d]/g, '');

const isValidCPF = (cpf) => {
    cpf = cleanAndValidate(cpf);
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
};

const isValidCNPJ = (cnpj) => {
    cnpj = cleanAndValidate(cnpj);
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0, pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;
    return true;
};

const formatDocument = (doc, type) => {
    let cleaned = cleanAndValidate(doc);
    if (Number(type) === 1) { 
        return cleaned
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    } else { 
        return cleaned
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }
};

const fornecedorSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, "A Razão Social é obrigatória (min 3 letras)."), 
  documento: z.string().min(1, "O documento é obrigatório."), 
  tipoDocumento: z.coerce.number().min(1).max(2).default(2),
  endereco: z.string().optional(),
  email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido.'),
  telefone: z.string().min(10, "Telefone inválido (mínimo 10 dígitos)."),
  observacoes: z.string().optional(),
  ativo: z.boolean().default(true),
}).superRefine((data, ctx) => {
  const cleanedDoc = cleanAndValidate(data.documento);

  if (data.tipoDocumento === 1) { 
    if (!isValidCPF(cleanedDoc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documento'],
        message: 'CPF inválido (dígito verificador incorreto).',
      });
    }
  } else if (data.tipoDocumento === 2) { 
    if (!isValidCNPJ(cleanedDoc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documento'],
        message: 'CNPJ inválido (dígito verificador incorreto).',
      });
    }
  }
});

function FornecedorForm() {
  const { id } = useParams(); 
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null); 

  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    watch,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: { tipoDocumento: 2 } 
  });
  
  const watchedTipoDocumento = watch('tipoDocumento', 2); 
  const watchedDocumento = watch('documento', ''); 
  
  const isPessoaJuridica = Number(watchedTipoDocumento) === 2;

  const { data: fornecedor, isLoading: isLoadingFornecedor } = useQuery({
    queryKey: ['fornecedor', id],
    queryFn: () => fornecedorService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && fornecedor) {
        const tipoDocumentoValue = fornecedor.tipoDocumento || 2;
        const documentoValue = fornecedor.cnpj || fornecedor.documento || '';
        
        reset({
            id: fornecedor.id,
            nome: fornecedor.razaoSocial || fornecedor.nome || '',
            documento: formatDocument(documentoValue, tipoDocumentoValue),
            tipoDocumento: tipoDocumentoValue,
            endereco: fornecedor.endereco || '',
            email: fornecedor.email || '',
            telefone: cleanAndValidate(fornecedor.telefone || ''),
            observacoes: fornecedor.observacoes || "",
            ativo: fornecedor.ativo ?? true,
        });
    } else if (!isEditing) {
      reset({ nome: '', documento: '', tipoDocumento: 2, endereco: '', email: '', telefone: '', observacoes: '', ativo: true });
    }
  }, [fornecedor, isEditing, reset]);

  const fetchCNPJData = async () => {
    setFeedbackMessage(null);
    const cleanedDoc = cleanAndValidate(watchedDocumento);
    
    if (!isValidCNPJ(cleanedDoc)) {
      setFeedbackMessage({ type: 'error', text: "CNPJ inválido. Verifique os dígitos antes de buscar." });
      return;
    }

    setIsFetchingCnpj(true);
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cleanedDoc}`);
        const data = response.data; 

        if (data && data.razao_social) {
            const enderecoCompleto = `${data.logradouro}, ${data.numero}${data.complemento ? ` (${data.complemento})` : ''} - ${data.bairro}, ${data.municipio}/${data.uf}`;
            
            setValue('nome', data.razao_social, { shouldValidate: true });
            setValue('endereco', enderecoCompleto, { shouldValidate: true });
            
            if (data.email) setValue('email', data.email, { shouldValidate: true });
            if (data.ddd_telefone_1) setValue('telefone', cleanAndValidate(data.ddd_telefone_1), { shouldValidate: true });

            setFeedbackMessage({ type: 'success', text: `Dados de "${data.nome_fantasia || data.razao_social}" carregados com sucesso!` });
        }
    } catch (error) {
        console.error("Erro na consulta CNPJ:", error);
        let msg = "Erro ao consultar a Receita Federal.";
        if (error.response?.status === 404) msg = "CNPJ não encontrado na base de dados.";
        else if (error.response?.status === 429) msg = "Muitas requisições. Tente novamente em instantes.";
        
        setFeedbackMessage({ type: 'error', text: msg });
    } finally {
        setIsFetchingCnpj(false);
    }
  };

  const handleMutationError = (error) => {
      console.error(error);
      const serverMessage = error.response?.data?.message || error.response?.data?.title || error.message;
      setFeedbackMessage({ 
          type: 'error', 
          text: `Erro ao salvar: ${serverMessage}. Verifique os campos.` 
      });
  };

  const createMutation = useMutation({
    mutationFn: fornecedorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      navigate('/settings/cadastros/fornecedores');
    },
    onError: handleMutationError
  });

  const updateMutation = useMutation({
    mutationFn: (data) => fornecedorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      queryClient.invalidateQueries({ queryKey: ['fornecedor', id] });
      navigate('/settings/cadastros/fornecedores');
    },
    onError: handleMutationError
  });

  const onSubmit = (data) => {
    setFeedbackMessage(null);
    const dataToSend = { 
        ...data, 
        documento: cleanAndValidate(data.documento),
        telefone: cleanAndValidate(data.telefone),
        Nome: data.nome 
    };
    
    if (isEditing) {
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isLoadingFornecedor;

  if (isEditing && isLoadingFornecedor) return <div className="loading-message">Carregando fornecedor...</div>;
  if (isEditing && !fornecedor) return <div className="error-message">Fornecedor não encontrado.</div>;

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</h1>

      {feedbackMessage && (
        <div 
            className={`feedback-box ${feedbackMessage.type}`}
            style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: feedbackMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${feedbackMessage.type === 'success' ? '#22c55e' : '#ef4444'}`,
                color: feedbackMessage.type === 'success' ? '#22c55e' : '#ef4444',
            }}
        >
            {feedbackMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span style={{ flexGrow: 1, fontSize: '0.9rem' }}>{feedbackMessage.text}</span>
            <button onClick={() => setFeedbackMessage(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                <X size={18} />
            </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label>Tipo de Cadastro</label>
          <div style={{ display: 'flex', gap: '30px', marginTop: '5px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
              <input 
                type="radio" 
                value="1" 
                {...register('tipoDocumento')} 
                // Importante: Tratamento manual do onChange para garantir atualização e reset
                onChange={(e) => {
                   register('tipoDocumento').onChange(e);
                   setValue('documento', '');
                   setFeedbackMessage(null);
                }}
              />
              Pessoa Física (CPF)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
              <input 
                type="radio" 
                value="2"
                {...register('tipoDocumento')} 
                onChange={(e) => {
                   register('tipoDocumento').onChange(e);
                   setValue('documento', '');
                   setFeedbackMessage(null);
                }}
              />
              Pessoa Jurídica (CNPJ)
            </label>
          </div>
          {errors.tipoDocumento && <span className="error">{errors.tipoDocumento.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="documento">{isPessoaJuridica ? 'CNPJ' : 'CPF'}</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
                id="documento" 
                {...register('documento', { 
                    onChange: (e) => {
                        const formattedValue = formatDocument(e.target.value, watchedTipoDocumento);
                        setValue('documento', formattedValue); 
                    } 
                })}
                placeholder={isPessoaJuridica ? '00.000.000/0000-00' : '000.000.000-00'}
                maxLength={isPessoaJuridica ? 18 : 14}
            />
            {isPessoaJuridica && (
              <button 
                type="button" 
                onClick={fetchCNPJData} 
                disabled={isFetchingCnpj || isEditing}
                style={{
                  padding: '0 15px', 
                  backgroundColor: 'var(--color-primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: isFetchingCnpj || isEditing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: isEditing ? 0.6 : 1
                }}
                title="Consultar dados na Receita"
              >
                {isFetchingCnpj ? '...' : <Search size={20} />}
              </button>
            )}
          </div>
          {errors.documento && <span className="error">{errors.documento.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nome">{isPessoaJuridica ? 'Razão Social' : 'Nome Completo'}</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="endereco">Endereço</label>
          <input id="endereco" {...register('endereco')} />
          {errors.endereco && <span className="error">{errors.endereco.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input 
            id="telefone" 
            {...register('telefone', {
                onChange: (e) => {
                   let v = cleanAndValidate(e.target.value).substring(0, 11);
                   if (v.length > 10) v = v.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
                   else if (v.length > 5) v = v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
                   else if (v.length > 2) v = v.replace(/^(\d\d)(\d{0,5}).*/, "($1) $2");
                   e.target.value = v;
                }
            })}
            placeholder="(99) 99999-9999"
          />
          {errors.telefone && <span className="error">{errors.telefone.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea id="observacoes" {...register('observacoes')} rows="3" />
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="ativo" {...register('ativo')} />
          <label htmlFor="ativo">Fornecedor Ativo?</label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/settings/cadastros/fornecedores')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={isPending}>
            {isPending ? (isEditing ? 'Salvando...' : 'Cadastrando...') : 'Salvar'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default FornecedorForm;