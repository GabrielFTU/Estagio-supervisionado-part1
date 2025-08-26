using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IUnidadeMedidaRepository
    {
        Task<UnidadeMedida> AddAsync(UnidadeMedida unidadeMedida);
        Task<UnidadeMedida?> GetByIdAsync(int id);
        Task<IEnumerable<UnidadeMedida>> GetAllAsync();
        Task UpdateAsync(UnidadeMedida unidadeMedida);
        Task DeleteAsync(int id);
    }
}