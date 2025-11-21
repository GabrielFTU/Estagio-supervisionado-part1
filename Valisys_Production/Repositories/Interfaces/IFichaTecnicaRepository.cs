using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IFichaTecnicaRepository
    {
        Task<FichaTecnica> AddAsync(FichaTecnica fichaTecnica);
        Task<FichaTecnica?> GetByIdAsync(Guid id);
        Task<IEnumerable<FichaTecnica>> GetAllAsync();
        Task<bool> UpdateAsync(FichaTecnica fichaTecnica);
        Task<bool> UpdateWithItemsAsync(FichaTecnica ficha, List<FichaTecnicaItem> novosItens);
        Task<bool> DeleteAsync(Guid id);
    }
}