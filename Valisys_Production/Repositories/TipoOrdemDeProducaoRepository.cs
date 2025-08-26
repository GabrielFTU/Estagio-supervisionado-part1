using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories
{
    public class TipoOrdemDeProducaoRepository : ITipoOrdemDeProducaoRepository
    {
        private readonly ApplicationDbContext _context;

        public TipoOrdemDeProducaoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TipoOrdemDeProducao> AddAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            _context.TiposDeOrdemDeProducao.Add(tipoOrdemDeProducao);
            await _context.SaveChangesAsync();
            return tipoOrdemDeProducao;
        }

        public async Task<TipoOrdemDeProducao?> GetByIdAsync(int id)
        {
            return await _context.TiposDeOrdemDeProducao
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<TipoOrdemDeProducao>> GetAllAsync()
        {
            return await _context.TiposDeOrdemDeProducao.AsNoTracking().ToListAsync();
        }

        public async Task UpdateAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            _context.TiposDeOrdemDeProducao.Update(tipoOrdemDeProducao);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var tipoOrdemDeProducao = await _context.TiposDeOrdemDeProducao.FindAsync(id);
            if (tipoOrdemDeProducao != null)
            {
                _context.TiposDeOrdemDeProducao.Remove(tipoOrdemDeProducao);
                await _context.SaveChangesAsync();
            }
        }
    }
}