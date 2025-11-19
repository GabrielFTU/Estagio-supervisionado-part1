import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import categoriaProdutoService from '../../services/categoriaProdutoService.js';
import '../../features/produto/ProdutoList.css'; 

function useCategorias() {
  return useQuery({
    queryKey: ['categoriasProduto'],
    queryFn: categoriaProdutoService.getAll
  });
}

function CategoriaProdutoList() {
  const { data: categorias, isLoading, isError, error } = useCategorias();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: categoriaProdutoService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriasProduto'] });
      alert("Categoria excluída com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao excluir. Verifique se há produtos vinculados.";
      alert(errorMessage);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading-message">Carregando...</div>;
  if (isError) return <div className="error-message">Erro ao carregar categorias: {error.message}</div>;

  const basePath = '/settings/cadastros/categorias';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Categorias de Produto</h1>
        <Link to={`${basePath}/novo`} className="btn-new">+ Nova Categoria</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias && categorias.length > 0 ? (
            categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nome}</td>
                <td>{categoria.codigo}</td>
                <td>
                  <span className={categoria.ativo ? 'status-ativo' : 'status-inativo'}>
                    {categoria.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`${basePath}/editar/${categoria.id}`)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-deletar" 
                    onClick={() => handleDelete(categoria.id)}
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
                Nenhuma categoria de produto encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriaProdutoList;