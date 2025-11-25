using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.DTOs;

namespace Valisys_Production.Services.Interfaces
{
    public interface IFichaTecnicaService
    {
        Task<FichaTecnica> CreateAsync(FichaTecnica ficha);
        Task<FichaTecnica?> GetByIdAsync(Guid id);
        Task<IEnumerable<FichaTecnica>> GetAllAsync();
        Task<IEnumerable<FichaTecnica>> GetByProdutoIdAsync(Guid produtoId);
        Task<string> ObterProximoCodigoAsync();
        Task<bool> DeleteAsync(Guid id);
        Task<bool> UpdateAsync(FichaTecnicaUpdateDto dto);
    }
}