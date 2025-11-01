using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Repositories
{
    public class FaseProducaoRepository : IFaseProducaoRepository
    {
        private readonly ApplicationDbContext _context;

        public FaseProducaoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FaseProducao> AddAsync(FaseProducao faseProducao)
        {
            _context.FasesProducao.Add(faseProducao);
            await _context.SaveChangesAsync();
            return faseProducao;
        }

        public async Task<FaseProducao?> GetByIdAsync(Guid id)
        {
            return await _context.FasesProducao
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<IEnumerable<FaseProducao>> GetAllAsync()
        {
            return await _context.FasesProducao.AsNoTracking().ToListAsync();
        }

        public async Task<bool> UpdateAsync(FaseProducao faseProducao)
        {
            _context.Entry(faseProducao).State = EntityState.Modified;

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
            var faseProducao = await _context.FasesProducao.FindAsync(id);

            if (faseProducao != null)
            {
                _context.FasesProducao.Remove(faseProducao);
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }

            return false;
        }
    }
}