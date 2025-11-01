using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface ISolicitacaoProducaoRepository
    {
        Task <SolicitacaoProducao> AddAsync(SolicitacaoProducao solicitacaoProducao);
        Task<SolicitacaoProducao> GetByIdAsync(Guid id);
        Task<IEnumerable<SolicitacaoProducao>> GetAllAsync();
        Task<bool> UpdateAsync(SolicitacaoProducao solicitacaoProducao);
        Task<bool> DeleteAsync(Guid id);
    }
}
