using Microsoft.EntityFrameworkCore;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Data;


namespace Valisys_Production.Repositories
{
    public class AlmoxarifadoRepository : IAlmoxarifadoRepository
    {
        private readonly ApplicationDbContext _context;

        public AlmoxarifadoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Almoxarifado> AddAsync(Almoxarifado almoxarifado)
        {
            _context.Almoxarifados.Add(almoxarifado);
            await _context.SaveChangesAsync();
            return almoxarifado;
        }

        public async Task<Almoxarifado?> GetByIdAsync(Guid id)
        {
            return await _context.Almoxarifados.FindAsync(id);
        }

        public async Task<IEnumerable<Almoxarifado>> GetAllAsync()
        {
            return await _context.Almoxarifados.AsNoTracking().ToListAsync();
        }

        public async Task<bool> UpdateAsync(Almoxarifado almoxarifado)
        {
            _context.Entry(almoxarifado).State = EntityState.Modified;

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
            var almoxarifado = await _context.Almoxarifados.FindAsync(id);

            if (almoxarifado != null)
            {
                _context.Almoxarifados.Remove(almoxarifado);
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }

            return false;
        }
    }
}