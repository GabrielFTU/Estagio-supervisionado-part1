using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface IFornecedorService
    {
        Task<Fornecedor> CreateAsync(Fornecedor fornecedor);
        Task<Fornecedor> GetByIdAsync(Guid id);
        Task<IEnumerable<Fornecedor>> GetAllAsync();
        Task UpdateAsync(Fornecedor fornecedor);
        Task DeleteAsync(Guid id);

    }
}
