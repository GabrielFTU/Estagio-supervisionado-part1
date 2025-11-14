import { useQuery } from '@tanstack/react-query';
// Verifique se estes caminhos usam './'
import ProdutosService from './ProdutosService'
import './Produtos.css'; 

function useProdutos() {
  return useQuery({
    queryKey: ['produtos'], 
    queryFn: ProdutosService.getAll, 
  });
}

function Produtos() {
  // ... (o resto do código permanece o mesmo)
  const { data: produtos, isLoading, isError, error } = useProdutos();

  if (isLoading) {
    return <div className="loading-message">Carregando produtos...</div>;
  }

  if (isError) {
    return <div className="error-message">Erro ao buscar produtos: {error.message}</div>;
  }

  return (
    <div className="produtos-page">
      <h1>Gerenciamento de Produtos</h1>
      <table className="produtos-table">
        {/* ... (o resto da tabela) ... */}
      </table>
    </div>
  );
}

export default Produtos;