import React, { useState, useEffect } from 'react';
import FornecedoresService from '../services/FornecedoresService';

const FornecedoresPage = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorForm, setFornecedorForm] = useState({
    nome: '',
    documento: '',
    tipoDocumento: 'CPF',
    endereco: '',
    email: '',
    telefone: '',
    observacoes: '',
  });

  const [editando, setEditando] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState(null);

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    try {
      const data = await FornecedoresService.getAll();
      setFornecedores(data);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFornecedorForm({ ...fornecedorForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tipoDocumentoNum = fornecedorForm.tipoDocumento === 'CPF' ? 0 : 1;
      const fornecedorData = { ...fornecedorForm, tipoDocumento: tipoDocumentoNum };

      if (editando) {
        await FornecedoresService.update(idEmEdicao, fornecedorData);
        setEditando(false);
        setIdEmEdicao(null);
      } else {
        await FornecedoresService.create(fornecedorData);
      }
      fetchFornecedores(); // Recarrega a lista
      setFornecedorForm({
        nome: '',
        documento: '',
        tipoDocumento: 'CPF',
        endereco: '',
        email: '',
        telefone: '',
        observacoes: '',
      });
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleEdit = (fornecedor) => {
    if (!fornecedor) return; // Checa se o objeto é válido
    setEditando(true);
    setIdEmEdicao(fornecedor.id);
    setFornecedorForm({ ...fornecedor, tipoDocumento: fornecedor.tipoDocumento === 0 ? 'CPF' : 'CNPJ' });
  };

  const handleDelete = async (id) => {
    try {
      await FornecedoresService.remove(id);
      fetchFornecedores(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Gerenciamento de Fornecedores</h1>

      {/* Formulário de Cadastro/Edição */}
      <h2>{editando ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <input type="text" name="nome" value={fornecedorForm.nome} onChange={handleInputChange} placeholder="Nome" required />
        <input type="text" name="documento" value={fornecedorForm.documento} onChange={handleInputChange} placeholder="Documento" required />
        <select name="tipoDocumento" value={fornecedorForm.tipoDocumento} onChange={handleInputChange}>
          <option value="CPF">CPF</option>
          <option value="CNPJ">CNPJ</option>
        </select>
        <input type="text" name="endereco" value={fornecedorForm.endereco} onChange={handleInputChange} placeholder="Endereço" />
        <input type="email" name="email" value={fornecedorForm.email} onChange={handleInputChange} placeholder="E-mail" />
        <input type="tel" name="telefone" value={fornecedorForm.telefone} onChange={handleInputChange} placeholder="Telefone" />
        <textarea name="observacoes" value={fornecedorForm.observacoes} onChange={handleInputChange} placeholder="Observações" style={{ gridColumn: 'span 2' }} />
        <button type="submit" style={{ gridColumn: 'span 2' }}>
          {editando ? 'Salvar Edição' : 'Adicionar'}
        </button>
      </form>   

      {/* Tabela de Fornecedores */}
      <h2 style={{ marginTop: '40px' }}>Lista de Fornecedores</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#474747ff' }}>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Nome Completo</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Documento</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>tipo do Documento</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((fornecedor) => (
            <tr key={fornecedor.id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{fornecedor.nome}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{fornecedor.documento}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{fornecedor.tipoDocumento}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{fornecedor.email}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <button onClick={() => handleEdit(fornecedor)} style={{ marginRight: '10px' }}>Editar</button>
                <button onClick={() => handleDelete(fornecedor.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FornecedoresPage;