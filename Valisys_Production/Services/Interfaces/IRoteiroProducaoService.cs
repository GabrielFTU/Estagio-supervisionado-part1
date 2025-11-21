using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.DTOs;
using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface IRoteiroProducaoService
    {
        Task<RoteiroProducao> CreateAsync(RoteiroProducaoCreateDto dto);
        Task<RoteiroProducao?> GetByIdAsync(Guid id);
        Task<IEnumerable<RoteiroProducao>> GetAllAsync();
        Task<bool> UpdateAsync(RoteiroProducaoUpdateDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}