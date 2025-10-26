using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories
{
    public class LoteRepository 
    {
        private readonly ApplicationDbContext _context;

        public LoteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Lote> AddAsync(Lote lote)
        {
            _context.Lotes.Add(lote);
            await _context.SaveChangesAsync();
            return lote;
        }

        public async Task<Lote?> GetByIdAsync(Guid id)
        {
            return await _context.Lotes
                .Include(l => l.Produto)
                .Include(l => l.Almoxarifado)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<IEnumerable<Lote>> GetAllAsync()
        {
            return await _context.Lotes
                .Include(l => l.Produto)
                .Include(l => l.Almoxarifado)
                .ToListAsync();
        }

        public async Task UpdateAsync(Lote lote)
        {
            _context.Lotes.Update(lote);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var lote = await _context.Lotes.FindAsync(id);
            if (lote != null)
            {
                _context.Lotes.Remove(lote);
                await _context.SaveChangesAsync();
            }
        }
    }
}