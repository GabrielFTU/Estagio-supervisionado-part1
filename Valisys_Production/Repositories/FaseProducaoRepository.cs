using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        public async Task<FaseProducao?> GetByIdAsync(int id)
        {
            return await _context.FasesProducao
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<IEnumerable<FaseProducao>> GetAllAsync()
        {
            return await _context.FasesProducao.AsNoTracking().ToListAsync();
        }

        public async Task UpdateAsync(FaseProducao faseProducao)
        {
            _context.FasesProducao.Update(faseProducao);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var faseProducao = await _context.FasesProducao.FindAsync(id);
            if (faseProducao != null)
            {
                _context.FasesProducao.Remove(faseProducao);
                await _context.SaveChangesAsync();
            }
        }
    }
}