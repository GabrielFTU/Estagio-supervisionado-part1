using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IPerfilRepository
    {
        Task<Perfil> AddAsync(Perfil perfil);
        Task<Perfil?> GetByIdAsync(Guid id);
        Task<IEnumerable<Perfil>> GetAllAsync();
        Task UpdateAsync(Perfil perfil);
        Task DeleteAsync(Guid id);
    }
}
