using Valisys_Production.DTOs;
using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface ILoteService
    {
        Task<Lote> CreateFromDtoAsync(LoteCreateDto dto);
        Task<Lote> CreateAsync(Lote lote);
        Task<Lote?> GetByIdAsync(Guid id);
        Task<IEnumerable<Lote>> GetAllAsync();
        Task UpdateAsync(Lote lote);
        Task DeleteAsync(Guid id);
    }
}