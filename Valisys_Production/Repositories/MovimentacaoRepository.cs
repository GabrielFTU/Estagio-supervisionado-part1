using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public async Task<Movimentacao?> GetByIdAsync(int id)
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
        public async Task UpdateAsync(Movimentacao movimentacao)
        {
            _context.Movimentacoes.Update(movimentacao);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var movimentacao = await _context.Movimentacoes.FindAsync(id);
            if (movimentacao != null)
            {
                _context.Movimentacoes.Remove(movimentacao);
                await _context.SaveChangesAsync();
            }
        }
    }
}