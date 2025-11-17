import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import produtoService from '../../services/produtoService.js';
import './ProdutoList.css';

function useProdutos() {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: () => produtoService.getAll(), 
  });
}

function ProdutoList() {
  const { data: produtos, isLoading, isError, error } = useProdutos();

  if (isLoading) {
    return <div className="loading-message">Carregando produtos...</div>;
  }

  if (isError) {
    return (
      <div className="error-message">
        Erro ao buscar produtos: {error?.message}
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Produtos</h1>
        <Link to="/produtos/novo" className="btn-new">
          + Adicionar Produto
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Referencia</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Un. Medida</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos?.length > 0 ? (
            produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.codigo}</td>
                <td>{produto.nome}</td>
                <td>{produto.categoriaProdutoNome}</td>
                <td>{produto.unidadeMedidaSigla}</td>

                <td>
                  <span
                    className={
                      produto.ativo ? 'status-ativo' : 'status-inativo'
                    }
                  >
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>

                <td className="acoes-cell">
                  <button className="btn-editar">Editar</button>
                  <button className="btn-deletar">Excluir</button>
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
