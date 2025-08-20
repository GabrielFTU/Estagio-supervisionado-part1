using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services.Interfaces
{
    public interface IUsuarioService
    {
        Task<Usuario> CreateAsync( Usuario usuario);
        Task<Usuario?> GetByIdAsync(int id);
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task UpdateAsync(Usuario usuario);
        Task DeleteAsync(int id);
    }
}
