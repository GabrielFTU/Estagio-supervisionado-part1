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
            return await _context.FasesProducao.AsNoTracking().OrderBy(f => f.Ordem).ToListAsync();
        }

        public async Task<bool> UpdateAsync(FaseProducao faseProducao)
        {
            var existing = await _context.FasesProducao.FindAsync(faseProducao.Id);
            if (existing == null) return false;

            existing.Nome = faseProducao.Nome;
            existing.Descricao = faseProducao.Descricao;
            existing.Ordem = faseProducao.Ordem;
            existing.TempoPadraoDias = faseProducao.TempoPadraoDias;
            existing.Ativo = faseProducao.Ativo;

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
            var faseProducao = await _context.FasesProducao.FindAsync(id);

            if (faseProducao != null)
            {
                faseProducao.Ativo = false;
                _context.Entry(faseProducao).State = EntityState.Modified;
                
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }

            return false;
        }
    }
}