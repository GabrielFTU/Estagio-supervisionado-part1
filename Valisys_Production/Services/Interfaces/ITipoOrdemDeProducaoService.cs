using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface ITipoOrdemDeProducaoService
    {
        Task<TipoOrdemDeProducao> CreateAsync(TipoOrdemDeProducao tipoOrdemDeProducao);
        Task<TipoOrdemDeProducao?> GetByIdAsync(int id);
        Task<IEnumerable<TipoOrdemDeProducao>> GetAllAsync();
        Task UpdateAsync(TipoOrdemDeProducao tipoOrdemDeProducao);
        Task DeleteAsync(int id);
    }
}