using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IFornecedorRepository
    {
        Task<Fornecedor> AddAsync(Fornecedor fornecedor);
        Task<Fornecedor> GetByIdAsync(Guid id);
        Task<IEnumerable<Fornecedor>> GetAllAsync();
        Task UpdateAsync(Fornecedor fornecedor);
        Task DeleteAsync(Guid id);
    }
}
