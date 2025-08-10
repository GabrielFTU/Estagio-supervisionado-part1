using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface IAlmoxarifadoService
    {
        Task<Almoxarifado> CreateAsync(Almoxarifado almoxarifado);
        Task<Almoxarifado> GetByIdAsync(int id);
        Task<IEnumerable<Almoxarifado>> GetAllAsync();
        Task UpdateAsync(Almoxarifado almoxarifado);
        Task DeleteAsync(int id);
    }
}
