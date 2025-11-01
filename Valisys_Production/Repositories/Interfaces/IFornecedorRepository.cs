using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IFornecedorRepository
    {
        Task<Fornecedor> AddAsync(Fornecedor fornecedor);
        Task<Fornecedor> GetByIdAsync(Guid id);
        Task<IEnumerable<Fornecedor>> GetAllAsync();
        Task<bool> UpdateAsync(Fornecedor fornecedor);
        Task<bool> DeleteAsync(Guid id);
    }
}
