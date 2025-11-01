using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface ICategoriaProdutoService
    {
        Task<CategoriaProduto> CreateAsync(CategoriaProduto categoriaProduto);
        Task<CategoriaProduto?> GetByIdAsync(Guid id);
        Task<IEnumerable<CategoriaProduto>> GetAllAsync();
        Task <bool> UpdateAsync(CategoriaProduto categoriaProduto);
        Task <bool> DeleteAsync(Guid id);
    }
}