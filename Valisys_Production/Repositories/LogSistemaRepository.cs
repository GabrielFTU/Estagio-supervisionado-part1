using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;

namespace Valisys_Production.Repositories
{
    public class LogSistemaRepository : ILogSistemaRepository
    {
        private readonly ApplicationDbContext _context;

        public LogSistemaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(LogSistema log)
        {
            _context.LogsSistema.Add(log);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<LogSistema>> GetAllAsync()
        {
            return await _context.LogsSistema
                .AsNoTracking()
                .Include(l => l.Usuario)
                .OrderByDescending(l => l.DataHora) 
                .ToListAsync();
        }
    }
}