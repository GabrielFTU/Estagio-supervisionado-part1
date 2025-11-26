import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import fichaTecnicaService from '../../services/fichaTecnicaService.js';
import '../../features/produto/ProdutoList.css';

function FichaTecnicaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: ficha, isLoading, isError, error } = useQuery({
    queryKey: ['fichaTecnica', id],
    queryFn: () => fichaTecnicaService.getById(id)
  });

  if (isLoading) return <div className="loading-message">Carregando detalhes...</div>;
  if (isError) return <div className="error-message">Erro: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <button onClick={() => navigate(-1)} className="btn-icon" style={{border: '1px solid #ccc'}}>
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 style={{margin: 0, fontSize: '1.5rem'}}>{ficha.produtoNome}</h1>
                <span style={{color: '#666', fontSize: '0.9rem'}}>Código: {ficha.codigo} | Versão: {ficha.versao}</span>
            </div>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
            <Link to={`/engenharia/fichas-tecnicas/editar/${ficha.id}`} className="btn-new" style={{backgroundColor: '#3b82f6'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <Edit size={18} />
                    <span>Editar</span>
                </div>
            </Link>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px'}}>
          <div className="card" style={{backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
              <h3>Dados da Ficha</h3>
              <p><strong>Descrição:</strong> {ficha.descricao || "N/A"}</p>
              <div style={{marginTop: '10px'}}>
                  <strong>Status: </strong> 
                  <span className={ficha.ativa ? 'status-ativo' : 'status-inativo'}>
                      {ficha.ativa ? 'Ativa' : 'Inativa'}
                  </span>
              </div>
          </div>
      </div>

      <h3 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '10px'}}>Lista de Componentes</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Componente</th>
            <th>Quantidade</th>
            <th>Un.</th>
            <th>Perda (%)</th>
          </tr>
        </thead>
        <tbody>
            {ficha.itens?.map(item => (
                <tr key={item.id}>
                    <td>{item.produtoComponenteCodigo}</td>
                    <td>{item.produtoComponenteNome}</td>
                    <td>{item.quantidade}</td>
                    <td>{item.unidadeMedida}</td>
                    <td>{item.perdaPercentual}%</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default FichaTecnicaDetails;