using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface ICategoriaProdutoRepository
    {
        Task<CategoriaProduto> AddAsync(CategoriaProduto categoriaProduto);
        Task<CategoriaProduto?> GetByIdAsync(Guid id);
        Task<IEnumerable<CategoriaProduto>> GetAllAsync();
        Task<bool> UpdateAsync(CategoriaProduto categoriaProduto);
        Task<bool> DeleteAsync(Guid id);

    }
}
