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
        Task<bool> UpdateAsync(UnidadeMedida unidadeMedida);
        Task<bool> DeleteAsync(Guid id);
    }
}