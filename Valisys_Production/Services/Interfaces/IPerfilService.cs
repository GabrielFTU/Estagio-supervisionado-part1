using Valisys_Production.Models;


namespace Valisys_Production.Services.Interfaces
{
    public interface IPerfilService
    {
        Task<Perfil> CreateAsync(Perfil perfil);
        Task<Perfil?> GetByIdAsync(Guid id);
        Task<IEnumerable<Perfil>> GetAllAsync();
        Task<bool> UpdateAsync(Perfil perfil);
        Task<bool> DeleteAsync(Guid id);
    }
}