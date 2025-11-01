using Valisys_Production.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IAlmoxarifadoRepository
    {
        Task<Almoxarifado> AddAsync(Almoxarifado almoxarifado);

        Task<Almoxarifado?> GetByIdAsync(Guid id);

        Task<IEnumerable<Almoxarifado>> GetAllAsync();
        Task<bool> UpdateAsync(Almoxarifado almoxarifado);
        Task<bool> DeleteAsync(Guid id);
    }
}