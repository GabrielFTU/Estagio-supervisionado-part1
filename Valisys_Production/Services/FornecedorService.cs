using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Services
{
    public class FornecedorService : IFornecedorService
    {
        private readonly IFornecedorRepository _repository;

        public FornecedorService(IFornecedorRepository fornecedorRepository)
        {
            _repository = fornecedorRepository;
        }

        public async Task<Fornecedor> CreateAsync(Fornecedor fornecedor)
        {
            if (string.IsNullOrEmpty(fornecedor.Nome))
            {
                throw new ArgumentException("Nome do fornecedor não pode estar vazio.");
            }
            fornecedor.DataCadastro = DateTime.UtcNow;
            return await _repository.AddAsync(fornecedor);
        }

        public async Task<Fornecedor?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Fornecedor inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<Fornecedor>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(Fornecedor fornecedor)
        {
            if (fornecedor.Id == Guid.Empty)
            {
                throw new ArgumentException("ID do Fornecedor ausente para atualização.");
            }
            if (string.IsNullOrEmpty(fornecedor.Nome))
            {
                throw new ArgumentException("Nome do fornecedor não pode estar vazio.");
            }

           
            var existingFornecedor = await _repository.GetByIdAsync(fornecedor.Id);
            if (existingFornecedor == null)
            {
                throw new KeyNotFoundException($"Fornecedor com ID {fornecedor.Id} não encontrado.");
            }

         
            return await _repository.UpdateAsync(fornecedor);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Fornecedor inválido para exclusão.");
            }

            var existingFornecedor = await _repository.GetByIdAsync(id);
            if (existingFornecedor == null)
            {
                return false;
            }

            return await _repository.DeleteAsync(id);
        }
    }
}