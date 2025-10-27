using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;

namespace Valisys_Production.Repositories
{
    public class MovimentacaoRepository : IMovimentacaoRepository
    {
        private readonly ApplicationDbContext _context;

        public MovimentacaoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Movimentacao> AddAsync(Movimentacao movimentacao)
        {
            _context.Movimentacoes.Add(movimentacao);
            await _context.SaveChangesAsync();
            return movimentacao;
        }

        public async Task<Movimentacao?> GetByIdAsync(Guid id)
        {
            return await _context.Movimentacoes
                .AsNoTracking()
                .Include(m => m.OrdemDeProducao)
                .Include(m => m.AlmoxarifadoOrigem)
                .Include(m => m.AlmoxarifadoDestino)
                .Include(m => m.Usuario)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<Movimentacao>> GetAllAsync()
        {
            return await _context.Movimentacoes
                .AsNoTracking()
                .Include(m => m.OrdemDeProducao)
                .Include(m => m.AlmoxarifadoOrigem)
                .Include(m => m.AlmoxarifadoDestino)
                .Include(m => m.Usuario)
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(Movimentacao movimentacao)
        {
            _context.Entry(movimentacao).State = EntityState.Modified;

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
            var movimentacao = await _context.Movimentacoes.FindAsync(id);

            if (movimentacao == null)
            {
                return false;
            }

            _context.Movimentacoes.Remove(movimentacao);
            var affectedRows = await _context.SaveChangesAsync();
            return affectedRows > 0;
        }
    }
}