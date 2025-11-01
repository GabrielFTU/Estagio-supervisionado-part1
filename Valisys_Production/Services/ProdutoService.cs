using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.Repositories.Interfaces;

namespace Valisys_Production.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _repository;

        public ProdutoService(IProdutoRepository repository)
        {
            _repository = repository;
        }

        public async Task<Produto> CreateAsync(Produto produto)
        {
            if (string.IsNullOrEmpty(produto.Nome))
            {
                throw new ArgumentException("O nome do produto não pode ser vazio.");
            }
            produto.DataCadastro = DateTime.UtcNow;
            return await _repository.AddAsync(produto);
        }

        public async Task<Produto?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Produto inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Produto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(Produto produto)
        {
            if (produto.Id == Guid.Empty)
            {
                throw new ArgumentException("ID do Produto ausente para atualização.");
            }
            if (string.IsNullOrEmpty(produto.Nome))
            {
                throw new ArgumentException("O nome do produto não pode ser vazio.");
            }

            var existingProduto = await _repository.GetByIdAsync(produto.Id);
            if (existingProduto == null)
            {
                throw new KeyNotFoundException($"Produto com ID {produto.Id} não encontrado.");
            }

            return await _repository.UpdateAsync(produto);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Produto inválido para exclusão.");
            }

            var existingProduto = await _repository.GetByIdAsync(id);

            if (existingProduto == null)
            {
                return false;
            }

            return await _repository.DeleteAsync(id);
        }
    }
}