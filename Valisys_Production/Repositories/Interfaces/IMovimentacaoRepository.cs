using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IMovimentacaoRepository
    {
        Task<Movimentacao> AddAsync(Movimentacao movimentacao);
        Task<Movimentacao?> GetByIdAsync(Guid id); 
        Task<IEnumerable<Movimentacao>> GetAllAsync();
        Task<bool> UpdateAsync(Movimentacao movimentacao);
        Task<bool> DeleteAsync(Guid id); 
    }
}