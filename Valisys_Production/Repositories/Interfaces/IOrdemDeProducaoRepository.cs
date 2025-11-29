using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.DTOs;
using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IOrdemDeProducaoRepository
    {
        Task<OrdemDeProducao> AddAsync(OrdemDeProducao ordemDeProducao);
        Task<OrdemDeProducao?> GetByIdAsync(Guid id);
        Task<OrdemDeProducao?> GetByCodigoAsync(string codigo);
        Task<IEnumerable<OrdemDeProducaoReadDto>> GetAllReadDtosAsync();
        Task<IEnumerable<OrdemDeProducao>> GetAllAsync();
        Task<bool> UpdateAsync(OrdemDeProducao ordemDeProducao);
        Task<bool> DeleteAsync(Guid id);
        Task<int> ObterProximoSequencialAsync(int ano);
    }
}