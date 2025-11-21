using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IRoteiroProducaoRepository
    {
        Task<RoteiroProducao> AddAsync(RoteiroProducao roteiro);
        Task<RoteiroProducao?> GetByIdAsync(Guid id);
        Task<IEnumerable<RoteiroProducao>> GetAllAsync();
        Task<bool> UpdateWithEtapasAsync(RoteiroProducao roteiro, List<RoteiroProducaoEtapa> novasEtapas);
        Task<bool> DeleteAsync(Guid id);
    }
}