using System.Threading.Tasks;
using Valisys_Production.Models;
using System.Collections.Generic;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IProdutoRepository
    {
        Task <Produto> AddAsync(Produto produto);
        Task<Produto> GetByIdAsync(Guid id);
        Task<IEnumerable<Produto>> GetAllAsync();
        Task UpdateAsync(Produto produto);
        Task DeleteAsync (Guid id);
    }
}
