using Valisys_Production.Models;
namespace Valisys_Production.Repositories.Interfaces
{
    public interface IAlmoxarifadoRepository
    {
        Task<Almoxarifado> AddAsync(Almoxarifado almoxarifado);
        Task<Almoxarifado> GetByIdAsync(Guid id);
        Task<IEnumerable<Almoxarifado>> GetAllAsync();
        Task UpdateAsync(Almoxarifado almoxarifado);
        Task DeleteAsync(Guid id);
    }
}
