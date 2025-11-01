using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IFaseProducaoRepository
    {
        Task<FaseProducao> AddAsync(FaseProducao faseProducao);
        Task<FaseProducao?> GetByIdAsync(Guid id);
        Task<IEnumerable<FaseProducao>> GetAllAsync();
        Task<bool> UpdateAsync(FaseProducao faseProducao);
        Task<bool> DeleteAsync(Guid id);
    }
}