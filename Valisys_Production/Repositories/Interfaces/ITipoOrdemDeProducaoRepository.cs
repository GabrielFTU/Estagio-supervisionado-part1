using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface ITipoOrdemDeProducaoRepository
    {
        Task<TipoOrdemDeProducao> AddAsync(TipoOrdemDeProducao tipoOrdemDeProducao);
        Task<TipoOrdemDeProducao?> GetByIdAsync(Guid id);
        Task<IEnumerable<TipoOrdemDeProducao>> GetAllAsync();
        Task<bool> UpdateAsync(TipoOrdemDeProducao tipoOrdemDeProducao);
        Task<bool> DeleteAsync(Guid id);
    }
}