using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface ILoteService
    {
        Task<Lote> CreateAsync(Lote lote);
        Task<Lote?> GetByIdAsync(int id);
        Task<IEnumerable<Lote>> GetAllAsync();
        Task UpdateAsync(Lote lote);
        Task DeleteAsync(int id);
    }
}