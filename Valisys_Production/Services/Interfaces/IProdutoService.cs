using Valisys_Production.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Valisys_Production.Services.Interfaces
{
    public interface IProdutoService
    {
        Task<Produto> CreateAsync(Produto produto);
        Task<Produto> GetByIdAsync(int id);
        Task<IEnumerable<Produto>> GetAllAsync();
        Task UpdateAsync(Produto produto);
        Task DeleteAsync(int id);
    }
}