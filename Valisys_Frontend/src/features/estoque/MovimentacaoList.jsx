import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRightLeft } from 'lucide-react';
import movimentacaoService from '../../services/movimentacaoService.js';
import '../../features/produto/ProdutoList.css';

function MovimentacaoList() {
  const { data: movimentacoes, isLoading, isError, error } = useQuery({
    queryKey: ['movimentacoes'],
    queryFn: movimentacaoService.getAll
  });

  if (isLoading) return <div className="loading-message">Carregando movimentações...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Histórico de Movimentações</h1>
        <Link to="/estoque/movimentacoes/novo" className="btn-new">
            <ArrowRightLeft size={18} style={{marginRight: '5px'}}/> 
            Nova Movimentação
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Origem</th>
            <th>Destino</th>
            <th>Usuário</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes && movimentacoes.length > 0 ? (
            movimentacoes.map((mov) => (
              <tr key={mov.id}>
                <td>{new Date(mov.dataMovimentacao).toLocaleDateString()} {new Date(mov.dataMovimentacao).toLocaleTimeString()}</td>
                <td>{mov.produtoNome}</td>
                <td style={{ fontWeight: 'bold' }}>{mov.quantidade}</td>
                <td>{mov.almoxarifadoOrigemNome}</td>
                <td>{mov.almoxarifadoDestinoNome}</td>
                <td>{mov.usuarioNome}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                Nenhuma movimentação registrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MovimentacaoList;