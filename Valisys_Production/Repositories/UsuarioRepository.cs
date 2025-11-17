using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace Valisys_Production.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly ApplicationDbContext _context;

        public UsuarioRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario> AddAsync(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            // CORREÇÃO: Faltava salvar as mudanças no banco de dados
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario?> GetByIdAsync(Guid id)
        {
            return await _context.Usuarios
                .AsNoTracking()
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios
                .AsNoTracking()
                .Include(u => u.Perfil)
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(Usuario usuario)
        {
            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                // CORREÇÃO: Faltava salvar as mudanças no banco de dados
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario != null)
            {
                _context.Usuarios.Remove(usuario);
                // CORREÇÃO: Faltava salvar as mudanças no banco de dados
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }
            return false;
        }

        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            return await _context.Usuarios
               .AsNoTracking()
               .Include(u => u.Perfil)
               .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}