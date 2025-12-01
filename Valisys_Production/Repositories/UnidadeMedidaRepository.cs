using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Repositories
{
    public class UnidadeMedidaRepository : IUnidadeMedidaRepository
    {
        private readonly ApplicationDbContext _context;

        public UnidadeMedidaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UnidadeMedida> AddAsync(UnidadeMedida unidadeMedida)
        {
            _context.UnidadesMedida.Add(unidadeMedida);
            await _context.SaveChangesAsync();
            return unidadeMedida;
        }

        public async Task<UnidadeMedida?> GetByIdAsync(Guid id)
        {
            return await _context.UnidadesMedida
                .AsNoTracking()
                .FirstOrDefaultAsync(um => um.Id == id);
        }

        public async Task<IEnumerable<UnidadeMedida>> GetAllAsync()
        {
            return await _context.UnidadesMedida.AsNoTracking().ToListAsync();
        }

        public async Task<bool> UpdateAsync(UnidadeMedida unidadeMedida)
        {
            var existing = await _context.UnidadesMedida.FindAsync(unidadeMedida.Id);
            if (existing == null) return false;

            existing.Nome = unidadeMedida.Nome;
            existing.Sigla = unidadeMedida.Sigla;
            existing.Grandeza = unidadeMedida.Grandeza;
            existing.FatorConversao = unidadeMedida.FatorConversao;
            existing.EhUnidadeBase = unidadeMedida.EhUnidadeBase;
            existing.Ativo = unidadeMedida.Ativo; 

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
            var unidadeMedida = await _context.UnidadesMedida.FindAsync(id);

            if (unidadeMedida != null)
            {
                unidadeMedida.Ativo = false;
                _context.Entry(unidadeMedida).State = EntityState.Modified;
          
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }
    }
}