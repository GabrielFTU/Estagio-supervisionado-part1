using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories
{
    public class SolicitacaoProducaoRepository : ISolicitacaoProducaoRepository
    {
        private readonly ApplicationDbContext _context;

        public SolicitacaoProducaoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SolicitacaoProducao> AddAsync(SolicitacaoProducao solicitacaoProducao)
        {
            _context.SolicitacoesProducao.Add(solicitacaoProducao);
            await _context.SaveChangesAsync();
            return solicitacaoProducao;
        }

        public async Task<SolicitacaoProducao?> GetByIdAsync(int id)
        {
            return await _context.SolicitacoesProducao
                .AsNoTracking()
                .Include(s => s.Produto)
                .Include(s => s.Encarregado)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<SolicitacaoProducao>> GetAllAsync()
        {
            return await _context.SolicitacoesProducao
                .AsNoTracking()
                .Include(s => s.Produto)
                .Include(s => s.Encarregado)
                .ToListAsync();
        }

        public async Task UpdateAsync(SolicitacaoProducao solicitacaoProducao)
        {
            _context.SolicitacoesProducao.Update(solicitacaoProducao);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var solicitacaoProducao = await _context.SolicitacoesProducao.FindAsync(id);
            if (solicitacaoProducao != null)
            {
                _context.SolicitacoesProducao.Remove(solicitacaoProducao);
                await _context.SaveChangesAsync();
            }
        }
    }
}