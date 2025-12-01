using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

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
            return await _context.Fornecedores
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<IEnumerable<Fornecedor>> GetAllAsync()
        {
            return await _context.Fornecedores
                .AsNoTracking()
                .ToListAsync();
        }
 
        public async Task<bool> UpdateAsync(Fornecedor fornecedor)
        {
            var existing = await _context.Fornecedores.FindAsync(fornecedor.Id);
            if (existing == null) return false;

            existing.Nome = fornecedor.Nome;
            existing.Documento = fornecedor.Documento;
            existing.TipoDocumento = fornecedor.TipoDocumento;
            existing.Email = fornecedor.Email;
            existing.Telefone = fornecedor.Telefone;
            existing.Endereco = fornecedor.Endereco;
            existing.Observacoes = fornecedor.Observacoes;
            existing.Ativo = fornecedor.Ativo; 

            _context.Entry(existing).State = EntityState.Modified;

            try
            {
                return await _context.SaveChangesAsync() > 0;
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
                fornecedor.Ativo = false;
                _context.Entry(fornecedor).State = EntityState.Modified;
                
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }
    }
}