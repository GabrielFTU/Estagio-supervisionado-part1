using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IOrdemDeProducaoRepository
    {
        Task<OrdemDeProducao> AddAsync(OrdemDeProducao ordemDeProducao);
        Task<OrdemDeProducao?> GetByIdAsync(Guid id);
        Task<IEnumerable<OrdemDeProducao>> GetAllAsync();
        Task UpdateAsync(OrdemDeProducao ordemDeProducao);
        Task DeleteAsync(Guid id);
    }
}