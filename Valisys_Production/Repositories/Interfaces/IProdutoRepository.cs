using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IProdutoRepository
    {
        Task <Produto> AddAsync(Produto produto);
        Task<Produto> GetByIdAsync(Guid id);
        Task<IEnumerable<Produto>> GetAllAsync();
        Task<bool> UpdateAsync(Produto produto);
        Task<bool> DeleteAsync (Guid id);
    }
}
