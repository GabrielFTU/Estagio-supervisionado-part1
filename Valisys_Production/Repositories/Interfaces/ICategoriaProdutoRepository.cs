using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface ICategoriaProdutoRepository
    {
        Task<CategoriaProduto> AddAsync(CategoriaProduto categoriaProduto);
        Task<CategoriaProduto?> GetByIdAsync(int id);
        Task<IEnumerable<CategoriaProduto>> GetAllAsync();
        Task UpdateAsync(CategoriaProduto categoriaProduto);
        Task DeleteAsync(int id);

    }
}
