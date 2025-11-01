using Microsoft.EntityFrameworkCore.Storage;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync();
        Task CommitAsync();
        Task RollbackAsync();
        Task<IDbContextTransaction> BeginTransactionAsync();
    }
}