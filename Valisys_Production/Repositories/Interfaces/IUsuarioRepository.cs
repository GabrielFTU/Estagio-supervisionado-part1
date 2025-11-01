using Valisys_Production.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario> AddAsync(Usuario usuario);
        Task<Usuario?> GetByIdAsync(Guid id);
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<bool> UpdateAsync(Usuario usuario);
        Task<bool> DeleteAsync(Guid id);
        Task<Usuario?> GetByEmailAsync(string email);
    }
}