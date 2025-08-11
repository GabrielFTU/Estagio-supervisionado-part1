using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface ILoteRepository
    {
        Task<Lote> AddAsync(Lote lote);
        Task<Lote?> GetByIdAsync(int id);
        Task<IEnumerable<Lote>> GetAllAsync();
        Task UpdateAsync(Lote lote);
        Task DeleteAsync(int id);
    }
}