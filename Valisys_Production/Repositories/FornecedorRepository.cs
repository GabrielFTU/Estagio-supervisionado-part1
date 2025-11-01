using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;


namespace Valisys_Production.Repositories
{
    public class FornecedorRepository : IFornecedorRepository
    {
        private readonly ApplicationDbContext _context;

        public FornecedorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Fornecedor> AddAsync(Fornecedor fornecedor)
        {
            _context.Fornecedores.Add(fornecedor);
            await _context.SaveChangesAsync();
            return fornecedor;
        }


        public async Task<Fornecedor?> GetByIdAsync(Guid id)
        {
            return await _context.Fornecedores.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<IEnumerable<Fornecedor>> GetAllAsync()
        {
            return await _context.Fornecedores.AsNoTracking().ToListAsync();
        }

 
        public async Task<bool> UpdateAsync(Fornecedor fornecedor)
        {
            _context.Entry(fornecedor).State = EntityState.Modified;

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
            var fornecedor = await _context.Fornecedores.FindAsync(id);

            if (fornecedor != null)
            {
                _context.Fornecedores.Remove(fornecedor);
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }

            return false;
        }
    }
}