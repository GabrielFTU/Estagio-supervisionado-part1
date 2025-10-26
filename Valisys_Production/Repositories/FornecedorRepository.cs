using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;

namespace Valisys_Production.Repositories;
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
    public async Task<Fornecedor> GetByIdAsync(Guid id) => await _context.Fornecedores.FindAsync(id);
    public async Task<IEnumerable<Fornecedor>> GetAllAsync()
    {
        return await _context.Fornecedores.ToListAsync();
    }
    public async Task UpdateAsync(Fornecedor fornecedor)
{
    _context.Fornecedores.Update(fornecedor);
    await _context.SaveChangesAsync();
}
    public async Task DeleteAsync(Guid id)
{
    var fornecedor = await _context.Fornecedores.FindAsync(id);
    if (fornecedor != null)
    {
        _context.Fornecedores.Remove(fornecedor);
        await _context.SaveChangesAsync();
    }
}
}

