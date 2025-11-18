import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import produtoService from '../../services/produtoService.js';
import './ProdutoList.css';

function useProdutos() {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: produtoService.getAll
  });
}

function ProdutoList() {
  const { data: produtos, isLoading, isError, error } = useProdutos();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Configuração da ação de deletar
  const deleteMutation = useMutation({
    mutationFn: produtoService.remove,
    onSuccess: () => {
      // Atualiza a lista automaticamente após excluir
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      alert("Produto excluído com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      alert("Erro ao excluir. O produto pode estar em uso.");
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Produtos</h1>
        <Link to="/produtos/novo" className="btn-new">+ Adicionar Produto</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Un.</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos && produtos.length > 0 ? (
            produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.codigo}</td>
                <td>{produto.nome}</td>
                <td>{produto.categoriaProdutoNome}</td>
                <td>{produto.unidadeMedidaSigla}</td>
                <td>
                  <span className={produto.ativo ? 'status-ativo' : 'status-inativo'}>
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  {/* Botão Editar */}
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`/produtos/editar/${produto.id}`)}
                  >
                    Editar
                  </button>
                  
                  {/* Botão Excluir */}
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(produto.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProdutoList;