using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        public async Task<CategoriaProduto?> GetByIdAsync(int id)
        {
            return await _context.CategoriasProduto
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<CategoriaProduto>> GetAllAsync()
        {
            return await _context.CategoriasProduto.AsNoTracking().ToListAsync();
        }

        public async Task UpdateAsync(CategoriaProduto categoriaProduto)
        {
            _context.CategoriasProduto.Update(categoriaProduto);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var categoriaProduto = await _context.CategoriasProduto.FindAsync(id);
            if (categoriaProduto != null)
            {
                _context.CategoriasProduto.Remove(categoriaProduto);
                await _context.SaveChangesAsync();
            }
        }
    }
}