import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import almoxarifadoService from '../../services/almoxarifadoService.js';
import '../../features/produto/ProdutoList.css'; 

function useAlmoxarifados() {
  return useQuery({
    queryKey: ['almoxarifados'],
    queryFn: almoxarifadoService.getAll
  });
}

function AlmoxarifadoList() {
  const { data: almoxarifados, isLoading, isError, error } = useAlmoxarifados();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: almoxarifadoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['almoxarifados'] });
      alert("Almoxarifado excluído com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao excluir. O almoxarifado pode estar em uso.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este almoxarifado?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar almoxarifados: {error.message}</div>;

  const basePath = '/settings/cadastros/almoxarifados';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Almoxarifados</h1>
        <Link to={`${basePath}/novo`} className="btn-new">+ Novo Almoxarifado</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Localização</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {almoxarifados && almoxarifados.length > 0 ? (
            almoxarifados.map((almoxarifado) => (
              <tr key={almoxarifado.id}>
                <td>{almoxarifado.nome}</td>
                <td>{almoxarifado.localizacao}</td>
                <td>
                  <span className={almoxarifado.ativo ? 'status-ativo' : 'status-inativo'}>
                    {almoxarifado.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`${basePath}/editar/${almoxarifado.id}`)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(almoxarifado.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                Nenhum almoxarifado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AlmoxarifadoList;