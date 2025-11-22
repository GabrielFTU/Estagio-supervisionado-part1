using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IOrdemDeProducaoRepository
    {
        Task<OrdemDeProducao> AddAsync(OrdemDeProducao ordemDeProducao);
        Task<OrdemDeProducao?> GetByIdAsync(Guid id);
        Task<OrdemDeProducao?> GetByCodigoAsync(string codigo);

        Task<IEnumerable<OrdemDeProducao>> GetAllAsync();
        Task<bool> UpdateAsync(OrdemDeProducao ordemDeProducao);
        Task<bool> DeleteAsync(Guid id);
    }
}