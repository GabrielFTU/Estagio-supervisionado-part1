using System.Threading.Tasks;
using Valisys_Production.DTOs;
using Valisys_Production.Models; 
namespace Valisys_Production.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(string Token, Usuario User)> LoginAsync(LoginDto loginDto);
    }
}