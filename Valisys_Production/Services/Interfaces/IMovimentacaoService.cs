using Valisys_Production.Models;
using Valisys_Production.DTOs;

namespace Valisys_Production.Services.Interfaces
{
    public interface IMovimentacaoService
    {
        Task<Movimentacao> CreateAsync(MovimentacaoCreateDto movimentacaoDto, Guid usuarioId);
        Task<Movimentacao?> GetByIdAsync(Guid id);
        Task<IEnumerable<Movimentacao>> GetAllAsync();
        Task<bool> UpdateAsync(Movimentacao movimentacao);
        Task<bool> DeleteAsync(Guid id);
    }
}