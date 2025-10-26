using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface ISolicitacaoProducaoRepository
    {
        Task <SolicitacaoProducao> AddAsync(SolicitacaoProducao solicitacaoProducao);
        Task<SolicitacaoProducao> GetByIdAsync(Guid id);
        Task<IEnumerable<SolicitacaoProducao>> GetAllAsync();
        Task UpdateAsync(SolicitacaoProducao solicitacaoProducao);
        Task DeleteAsync(Guid id);
    }
}
