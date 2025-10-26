using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface IOrdemDeProducaoService
    {
        Task<OrdemDeProducao> CreateAsync(OrdemDeProducao ordemDeProducao);
        Task<OrdemDeProducao?> GetByIdAsync(Guid id);
        Task<IEnumerable<OrdemDeProducao>> GetAllAsync();
        Task UpdateAsync(OrdemDeProducao ordemDeProducao);
        Task DeleteAsync(Guid id);
    }
}