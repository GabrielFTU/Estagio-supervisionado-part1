using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface IUnidadeMedidaService
    {
        Task<UnidadeMedida> CreateAsync(UnidadeMedida unidadeMedida);
        Task<UnidadeMedida?> GetByIdAsync(Guid id);
        Task<IEnumerable<UnidadeMedida>> GetAllAsync();
        Task UpdateAsync(UnidadeMedida unidadeMedida);
        Task DeleteAsync(Guid id);
    }
}