using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface IPerfilService
    {
        Task<Perfil> CreateAsync(Perfil perfil);
        Task<Perfil?> GetByIdAsync(int id);
        Task<IEnumerable<Perfil>> GetAllAsync();
        Task UpdateAsync(Perfil perfil);
        Task DeleteAsync(int id);
    }
}
