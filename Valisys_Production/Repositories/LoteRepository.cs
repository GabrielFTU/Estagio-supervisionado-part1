using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Repositories
{
    public class LoteRepository : ILoteRepository
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
                .AsNoTracking()
                .Include(l => l.Produto)
                .Include(l => l.Almoxarifado)
                .Include(l => l.OrdensDeProducao)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<IEnumerable<Lote>> GetAllAsync()
        {
            return await _context.Lotes
                .AsNoTracking()
                .Include(l => l.Produto)
                .Include(l => l.Almoxarifado)
                .Include(l => l.OrdensDeProducao)
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(Lote lote)
        {
            _context.Entry(lote).State = EntityState.Modified;

            try
            {
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var lote = await _context.Lotes.FindAsync(id);

            if (lote != null)
            {
                lote.statusLote = StatusLote.Cancelado;
                _context.Entry(lote).State = EntityState.Modified;
                
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }

            return false;
        }
    }
}