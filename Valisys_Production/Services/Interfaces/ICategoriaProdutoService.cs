using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface ICategoriaProdutoService
    {
        Task<CategoriaProduto> CreateAsync(CategoriaProduto categoriaProduto);
        Task<CategoriaProduto?> GetByIdAsync(int id);
        Task<IEnumerable<CategoriaProduto>> GetAllAsync();
        Task UpdateAsync(CategoriaProduto categoriaProduto);
        Task DeleteAsync(int id);
    }
}