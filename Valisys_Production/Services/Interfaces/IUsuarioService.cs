using Valisys_Production.Models;
using Valisys_Production.DTOs;

namespace Valisys_Production.Services.Interfaces
{
    public interface IUsuarioService
    {
        Task<Usuario> CreateAsync(UsuarioCreateDto usuarioDto);
        Task<Usuario?> GetByIdAsync(Guid id);
        Task<Usuario?> GetByEmailAsync(string email);
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<bool> UpdateAsync(Usuario usuario);
        Task<bool> DeleteAsync(Guid id);
    }
}