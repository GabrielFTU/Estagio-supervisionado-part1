using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

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
            return tipoOrdemDeProducao;
        }

        public async Task<TipoOrdemDeProducao?> GetByIdAsync(Guid id)
        {
            return await _context.TiposDeOrdemDeProducao
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<TipoOrdemDeProducao>> GetAllAsync()
        {
            return await _context.TiposDeOrdemDeProducao.AsNoTracking().ToListAsync();
        }

        public async Task<bool> UpdateAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            _context.Entry(tipoOrdemDeProducao).State = EntityState.Modified;

            try
            {
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var tipoOrdemDeProducao = await _context.TiposDeOrdemDeProducao.FindAsync(id);

            if (tipoOrdemDeProducao != null)
            {
                _context.TiposDeOrdemDeProducao.Remove(tipoOrdemDeProducao);
  
                return true;
            }

            return false;
        }
    }
}