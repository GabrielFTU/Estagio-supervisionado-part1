using Valisys_Production.DTOs;
using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Services.Interfaces
{
    public interface ILoteService
    {
        Task<Lote> CreateAsync(LoteCreateDto dto);
        Task<Lote?> GetByIdAsync(Guid id);
        Task<IEnumerable<Lote>> GetAllAsync();
        Task<bool> UpdateAsync(Lote lote);
        Task<bool> DeleteAsync(Guid id);
    }
}