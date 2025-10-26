using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface ISolicitacaoProducaoService
    {
        Task<SolicitacaoProducao> CreateAsync(SolicitacaoProducao solicitacaoProducao);
        Task<SolicitacaoProducao?> GetByIdAsync(Guid id);
        Task<IEnumerable<SolicitacaoProducao>> GetAllAsync();
        Task UpdateAsync(SolicitacaoProducao solicitacaoProducao);
        Task DeleteAsync(Guid id);
        Task<List<OrdemDeProducao>> AprovarSolicitacaoAsync(Guid solicitacaoId, Guid usuarioAprovadorId);
    }
}