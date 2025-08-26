using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface IMovimentacaoService
    {
        Task<Movimentacao> CreateAsync(Movimentacao movimentacao);
        Task<Movimentacao?> GetByIdAsync(int id);
        Task<IEnumerable<Movimentacao>> GetAllAsync();
        Task UpdateAsync(Movimentacao movimentacao);
        Task DeleteAsync(int id);
    }
}
