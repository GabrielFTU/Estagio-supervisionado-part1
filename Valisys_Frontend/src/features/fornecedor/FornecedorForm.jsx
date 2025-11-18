import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Search } from 'lucide-react'; 
import axios from 'axios'; 

import fornecedorService from '../../services/fornecedorService.js';
import '../../features/produto/ProdutoForm.css';

const cleanAndValidate = (doc) => (doc || '').replace(/[^\d]/g, '');
const validateCPF = (cpf) => cleanAndValidate(cpf).length === 11;
const validateCNPJ = (cnpj) => cleanAndValidate(cnpj).length === 14;

const formatDocument = (doc, type) => {
    let cleaned = cleanAndValidate(doc);

    if (type === 1) { 
        cleaned = cleaned.substring(0, 11);
        if (cleaned.length > 9) {
            cleaned = cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else if (cleaned.length > 6) {
            cleaned = cleaned.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (cleaned.length > 3) {
            cleaned = cleaned.replace(/^(\d{3})(\d{3})$/, '$1.$2');
        }
    } else if (type === 2) { 
        cleaned = cleaned.substring(0, 14);
        if (cleaned.length > 12) {
            cleaned = cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        } else if (cleaned.length > 8) {
            cleaned = cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, '$1.$2.$3/$4');
        } else if (cleaned.length > 5) {
            cleaned = cleaned.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (cleaned.length > 2) {
            cleaned = cleaned.replace(/^(\d{2})(\d{3})$/, '$1.$2');
        }
    }

    return cleaned;
};

const fornecedorSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome/razao social é obrigatório."), 
  documento: z.string().min(1, "O documento é obrigatório."), 
  tipoDocumento: z.coerce.number().min(1).max(2).default(2),
  endereco: z.string().min(1, "O endereço é obrigatório."),
  email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido.'),
  telefone: z.string().min(8, "Telefone inválido."),
  observacoes: z.string().optional(),
  ativo: z.boolean().default(true),
}).superRefine((data, ctx) => {
  const cleanedDoc = cleanAndValidate(data.documento);

  if (data.tipoDocumento === 1) { 
    if (!validateCPF(cleanedDoc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documento'],
        message: 'CPF inválido. Deve conter 11 dígitos.',
      });
    }
  } else if (data.tipoDocumento === 2) { 
    if (!validateCNPJ(cleanedDoc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documento'],
        message: 'CNPJ inválido. Deve conter 14 dígitos.',
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

  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    watch,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(fornecedorSchema)
  });
  
  const watchedTipoDocumento = watch('tipoDocumento', 2); 
  const watchedDocumento = watch('documento', ''); 

  const { data: fornecedor, isLoading: isLoadingFornecedor } = useQuery({
    queryKey: ['fornecedor', id],
    queryFn: () => fornecedorService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && fornecedor) {
        const tipoDocumentoValue = fornecedor.tipoDocumento || 2; 
        
        const documentoValue = fornecedor.cnpj || fornecedor.documento || '';
        const initialDoc = formatDocument(documentoValue, tipoDocumentoValue);
        const initialTel = cleanAndValidate(fornecedor.telefone || '');

        reset({
            id: fornecedor.id,
            nome: fornecedor.razaoSocial || fornecedor.nome || '',
            documento: initialDoc,
            tipoDocumento: tipoDocumentoValue,
            endereco: fornecedor.endereco || '',
            email: fornecedor.email || '',
            telefone: initialTel,
            observacoes: fornecedor.observacoes || "",
            ativo: fornecedor.ativo ?? true,
        });
    } else if (!isEditing) {
      reset({ nome: '', documento: '', tipoDocumento: 2, endereco: '', email: '', telefone: '', observacoes: '', ativo: true });
    }
  }, [fornecedor, isEditing, reset]);

  const fetchCNPJData = async () => {
    const cleanedDoc = cleanAndValidate(watchedDocumento);
    if (!validateCNPJ(cleanedDoc)) {
      alert("CNPJ inválido para consulta. Verifique o formato (14 dígitos).");
      return;
    }

    setIsFetchingCnpj(true);
    try {
        const response = await axios.get(`http://brasilapi.com.br/api/cnpj/v1/${cleanedDoc}`);
        const data = response.data; 

        if (data && data.razao_social) {
            
            const logradouro = data.logradouro || '';
            const numero = data.numero || '';
            const complemento = data.complemento ? ` (${data.complemento})` : '';
            const bairro = data.bairro || '';
            const municipio = data.municipio || '';
            const uf = data.uf || '';
            
            const enderecoCompleto = `${logradouro}, ${numero}${complemento} - ${bairro}, ${municipio}/${uf}`;
            
            const telefoneLimpo = cleanAndValidate(data.telefone || '');

            setValue('nome', data.razao_social, { shouldValidate: true });
            setValue('endereco', enderecoCompleto, { shouldValidate: true });
            setValue('email', data.email || '', { shouldValidate: true });
            setValue('telefone', telefoneLimpo, { shouldValidate: true });

            alert(`Dados da empresa "${data.razao_social}" carregados com sucesso.`);
        } else {
            alert(`CNPJ ${cleanedDoc} não encontrado na base de dados BrasilAPI.`);
        }

    } catch (error) {
        let errorMessage = "Erro ao consultar a API BrasilAPI. (Verifique o console para detalhes).";
        if (error.response) {
            if (error.response.status === 404) {
                errorMessage = "CNPJ não encontrado na base de dados (404).";
            } else if (error.response.status === 400) {
                errorMessage = "CNPJ inválido ou fora do formato esperado (400 Bad Request).";
            }
        }
        console.error("Erro na consulta CNPJ:", error);
        alert(errorMessage);
    } finally {
        setIsFetchingCnpj(false);
    }
  };


  const createMutation = useMutation({
    mutationFn: fornecedorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      navigate('/settings/cadastros/fornecedores');
    },
    onError: (error) => {
      console.error("Erro ao criar fornecedor:", error);
      alert(`Falha ao criar o fornecedor: ${error.response?.data?.message || error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => fornecedorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      queryClient.invalidateQueries({ queryKey: ['fornecedor', id] });
      navigate('/settings/cadastros/fornecedores');
    },
    onError: (err) => {
      console.error(err);
      alert(`Erro ao atualizar fornecedor: ${err.response?.data?.message || err.message}`);
    }
  });

  const onSubmit = (data) => {
    const dataToSend = { 
        ...data, 
        documento: cleanAndValidate(data.documento),
        telefone: cleanAndValidate(data.telefone),
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
      <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
        
        <div className="form-group">
          <label>Tipo de Cadastro</label>
          <div style={{ display: 'flex', gap: '30px', marginTop: '5px' }}>

            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal', fontSize: '0.9375rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                value={1} 
                {...register('tipoDocumento', { valueAsNumber: true })}
                onClick={() => setValue('documento', '', { shouldValidate: true })}
                style={{ width: '1rem', height: '1rem', marginRight: '8px' }}
              />
              Pessoa Física (CPF)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal', fontSize: '0.9375rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                value={2} 
                {...register('tipoDocumento', { valueAsNumber: true })}
                onClick={() => setValue('documento', '', { shouldValidate: true })}
                style={{ width: '1rem', height: '1rem', marginRight: '8px' }}
              />
              Pessoa Jurídica (CNPJ)
            </label>
          </div>
          {errors.tipoDocumento && <span className="error">{errors.tipoDocumento.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="documento">{watchedTipoDocumento == 1 ? 'CPF' : 'CNPJ'}</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
                id="documento" 
                {...register('documento', { 
                    onChange: (e) => {
                        const cleanValue = cleanAndValidate(e.target.value);
                        const formattedValue = formatDocument(cleanValue, watchedTipoDocumento);
                        
                        e.target.value = formattedValue;
                        setValue('documento', formattedValue, { shouldValidate: true });
                    } 
                })}
                placeholder={watchedTipoDocumento == 1 ? 'Ex: 123.456.789-00' : 'Ex: 12.345.678/0001-00'}
            />
            {watchedTipoDocumento == 2 && (
              <button 
                type="button" 
                onClick={fetchCNPJData} 
                className="btn-cnpj-search" 
                disabled={isFetchingCnpj || !validateCNPJ(watchedDocumento) || isEditing}
                style={{
                  padding: '0 15px', 
                  backgroundColor: '#42a5f5', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isFetchingCnpj ? 'Buscando...' : <Search size={20} />}
              </button>
            )}
          </div>
          {errors.documento && <span className="error">{errors.documento.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nome">{watchedTipoDocumento == 1 ? 'Nome Completo' : 'Razão Social'}</label>
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
          <label htmlFor="telefone">Telefone (apenas números)</label>
          <input id="telefone" {...register('telefone')} 
            onInput={(e) => { e.target.value = cleanAndValidate(e.target.value); }} 
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
            {isPending ? (isEditing ? 'Salvando...' : 'Criando...') : 'Salvar'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default FornecedorForm;