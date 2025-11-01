using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface ILoteRepository
    {
        Task<Lote> AddAsync(Lote lote);
        Task<Lote?> GetByIdAsync(Guid id);
        Task<IEnumerable<Lote>> GetAllAsync();
        Task<bool> UpdateAsync(Lote lote);
        Task<bool> DeleteAsync(Guid id);
    }
}