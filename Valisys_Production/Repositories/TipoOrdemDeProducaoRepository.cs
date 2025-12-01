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
            await _context.SaveChangesAsync();
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
            return await _context.TiposDeOrdemDeProducao
                .AsNoTracking()
                .OrderBy(t => t.Nome)
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            var existing = await _context.TiposDeOrdemDeProducao.FindAsync(tipoOrdemDeProducao.Id);
            if (existing == null) return false;

            existing.Nome = tipoOrdemDeProducao.Nome;
            existing.Codigo = tipoOrdemDeProducao.Codigo;
            existing.Ativo = tipoOrdemDeProducao.Ativo;

            _context.Entry(existing).State = EntityState.Modified;

            try
            {
                return await _context.SaveChangesAsync() > 0;
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
                tipoOrdemDeProducao.Ativo = false;
                _context.Entry(tipoOrdemDeProducao).State = EntityState.Modified;
  
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }
    }
}