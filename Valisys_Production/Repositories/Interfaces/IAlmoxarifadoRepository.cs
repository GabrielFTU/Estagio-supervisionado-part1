using Valisys_Production.Models;
namespace Valisys_Production.Repositories.Interfaces
{
    public interface IAlmoxarifadoRepository
    {
        Task<Almoxarifado> AddAsync(Almoxarifado almoxarifado);
        Task<Almoxarifado> GetByIdAsync(int id);
        Task<IEnumerable<Almoxarifado>> GetAllAsync();
        Task UpdateAsync(Almoxarifado almoxarifado);
        Task DeleteAsync(int id);
    }
}
