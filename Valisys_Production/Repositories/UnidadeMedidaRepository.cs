
using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        public async Task UpdateAsync(UnidadeMedida unidadeMedida)
        {
            _context.UnidadesMedida.Update(unidadeMedida);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var unidadeMedida = await _context.UnidadesMedida.FindAsync(id);
            if (unidadeMedida != null)
            {
                _context.UnidadesMedida.Remove(unidadeMedida);
                await _context.SaveChangesAsync();
            }
        }
    }
}