using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario> AddAsync(Usuario usuario);
        Task<Usuario?> GetByIdAsync(int id);
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task UpdateAsync(Usuario usuario);
        Task DeleteAsync(int id);
    }
}