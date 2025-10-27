using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IOrdemDeProducaoRepository
    {
        Task<OrdemDeProducao> AddAsync(OrdemDeProducao ordemDeProducao);
        Task<OrdemDeProducao?> GetByIdAsync(Guid id);
        Task<IEnumerable<OrdemDeProducao>> GetAllAsync();
        Task<bool> UpdateAsync(OrdemDeProducao ordemDeProducao);
        Task<bool> DeleteAsync(Guid id);
    }
}