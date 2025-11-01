using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface IProdutoService
    {
        Task<Produto> CreateAsync(Produto produto);
        Task<Produto?> GetByIdAsync(Guid id);
        Task<IEnumerable<Produto>> GetAllAsync();
        Task<bool> UpdateAsync(Produto produto);
        Task<bool> DeleteAsync(Guid id);
    }
}