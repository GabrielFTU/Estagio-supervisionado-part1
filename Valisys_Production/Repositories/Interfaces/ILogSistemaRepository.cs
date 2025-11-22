using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface ILogSistemaRepository
    {
        Task AddAsync(LogSistema log);
        Task<IEnumerable<LogSistema>> GetAllAsync();
    }
}