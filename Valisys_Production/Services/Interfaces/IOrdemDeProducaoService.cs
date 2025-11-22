using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface IOrdemDeProducaoService
    {
        Task<OrdemDeProducao> CreateAsync(OrdemDeProducao ordemDeProducao, Guid usuarioId);
        Task<OrdemDeProducao?> GetByIdAsync(Guid id);
        Task<OrdemDeProducao?> GetByCodigoAsync(string codigo);
        Task<IEnumerable<OrdemDeProducao>> GetAllAsync();
        Task<bool> UpdateAsync(OrdemDeProducao ordemDeProducao);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> MovimentarProximaFaseAsync(Guid ordemId);
        Task FinalizarOrdemAsync(Guid ordemId, Guid usuarioId);
        Task TrocarFaseAsync(Guid ordemId, Guid novaFaseId);
    }
}