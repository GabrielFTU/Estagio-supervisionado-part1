using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface IFaseProducaoService
    {
        Task<FaseProducao> CreateAsync(FaseProducao faseProducao);
        Task<FaseProducao?> GetByIdAsync(Guid id);
        Task<IEnumerable<FaseProducao>> GetAllAsync();
        Task UpdateAsync(FaseProducao faseProducao);
        Task DeleteAsync(Guid id);
    }
}