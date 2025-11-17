using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Repositories
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly ApplicationDbContext _context;

        public ProdutoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Produto> AddAsync(Produto produto)
        {
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();
            return produto;
        }

        public async Task<Produto?> GetByIdAsync(Guid id)
        {
            return await _context.Produtos
                .AsNoTracking()
                .Include(p => p.CategoriaProduto)
                .Include(p => p.UnidadeMedida)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Produto>> GetAllAsync()
        {
            return await _context.Produtos
                .AsNoTracking()
                .AsNoTracking()
                .Include(p => p.CategoriaProduto)
                .Include(p => p.UnidadeMedida)
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(Produto produto)
        {
            _context.Entry(produto).State = EntityState.Modified;

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
            var produto = await _context.Produtos.FindAsync(id);

            if (produto != null)
            {
                _context.Produtos.Remove(produto);
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }

            return false;
        }
    }
}