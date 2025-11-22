using System.Threading.Tasks;
using Valisys_Production.DTOs;

namespace Valisys_Production.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync();
    }
}