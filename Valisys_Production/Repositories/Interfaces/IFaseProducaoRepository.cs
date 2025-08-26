using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IFaseProducaoRepository
    {
        Task<FaseProducao> AddAsync(FaseProducao faseProducao);
        Task<FaseProducao?> GetByIdAsync(int id);
        Task<IEnumerable<FaseProducao>> GetAllAsync();
        Task UpdateAsync(FaseProducao faseProducao);
        Task DeleteAsync(int id);
    }
}