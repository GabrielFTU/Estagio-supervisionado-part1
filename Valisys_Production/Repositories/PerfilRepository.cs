using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System;

namespace Valisys_Production.Repositories
{
    public class PerfilRepository : IPerfilRepository
    {
        private readonly ApplicationDbContext _context;

        public PerfilRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Perfil> AddAsync(Perfil perfil)
        {
            _context.Perfis.Add(perfil);
            await _context.SaveChangesAsync();
            return perfil;
        }

        public async Task<Perfil?> GetByIdAsync(Guid id)
        {
            return await _context.Perfis
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Perfil>> GetAllAsync()
        {
            return await _context.Perfis
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(Perfil perfil)
        {
            _context.Entry(perfil).State = EntityState.Modified;

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
            var perfil = await _context.Perfis.FindAsync(id);

            if (perfil != null)
            {
                _context.Perfis.Remove(perfil);
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }

            return false;
        }
    }
}