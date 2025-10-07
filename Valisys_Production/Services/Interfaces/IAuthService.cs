using System.Threading.Tasks;
using Valisys_Production.DTOs;
namespace Valisys_Production.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> LoginAsync(LoginDto loginDto);
    }
}
