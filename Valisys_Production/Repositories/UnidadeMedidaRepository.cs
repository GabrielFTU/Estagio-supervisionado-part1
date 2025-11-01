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
  
            _context.Entry(unidadeMedida).State = EntityState.Modified;

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
            var unidadeMedida = await _context.UnidadesMedida.FindAsync(id);

            if (unidadeMedida != null)
            {
                _context.UnidadesMedida.Remove(unidadeMedida);
          
                return true;
            }

            return false;
        }
    }
}