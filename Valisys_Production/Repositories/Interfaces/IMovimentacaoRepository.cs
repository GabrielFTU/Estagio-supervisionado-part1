using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IMovimentacaoRepository
    {
        Task<Movimentacao> AddAsync(Movimentacao movimentacao);
        Task<Movimentacao?> GetByIdAsync(int id);
        Task<IEnumerable<Movimentacao>> GetAllAsync();
        Task UpdateAsync(Movimentacao movimentacao);
        Task DeleteAsync(int id);

    }
}
