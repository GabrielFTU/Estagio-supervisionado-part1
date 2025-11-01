using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Repositories
{
    public class CategoriaProdutoRepository : ICategoriaProdutoRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoriaProdutoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CategoriaProduto> AddAsync(CategoriaProduto categoriaProduto)
        {
            _context.CategoriasProduto.Add(categoriaProduto);
            await _context.SaveChangesAsync();
            return categoriaProduto;
        }

        public async Task<CategoriaProduto?> GetByIdAsync(Guid id)
        {
            return await _context.CategoriasProduto
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<CategoriaProduto>> GetAllAsync()
        {
            return await _context.CategoriasProduto.AsNoTracking().ToListAsync();
        }

        public async Task<bool> UpdateAsync(CategoriaProduto categoriaProduto)
        {
            _context.Entry(categoriaProduto).State = EntityState.Modified;

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
            var categoriaProduto = await _context.CategoriasProduto.FindAsync(id);

            if (categoriaProduto != null)
            {
                _context.CategoriasProduto.Remove(categoriaProduto);
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }

            return false;
        }
    }
}