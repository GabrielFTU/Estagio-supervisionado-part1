using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;

namespace Valisys_Production.Repositories
{
    public class RoteiroProducaoRepository : IRoteiroProducaoRepository
    {
        private readonly ApplicationDbContext _context;

        public RoteiroProducaoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RoteiroProducao> AddAsync(RoteiroProducao roteiro)
        {
            _context.RoteirosProducao.Add(roteiro);
            await _context.SaveChangesAsync();
            return roteiro;
        }

        public async Task<RoteiroProducao?> GetByIdAsync(Guid id)
        {
            return await _context.RoteirosProducao
                .AsNoTracking()
                .Include(r => r.Produto)
                .Include(r => r.Etapas.OrderBy(e => e.Ordem))
                    .ThenInclude(e => e.FaseProducao)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<RoteiroProducao>> GetAllAsync()
        {
            return await _context.RoteirosProducao
                .AsNoTracking()
                .Include(r => r.Produto)
                .Include(r => r.Etapas)
                .OrderBy(r => r.Produto.Nome)
                .ToListAsync();
        }

        public async Task<bool> UpdateWithEtapasAsync(RoteiroProducao roteiro, List<RoteiroProducaoEtapa> novasEtapas)
        {
            var roteiroExistente = await _context.RoteirosProducao
                .Include(r => r.Etapas)
                .FirstOrDefaultAsync(r => r.Id == roteiro.Id);

            if (roteiroExistente == null) return false;

            _context.Entry(roteiroExistente).CurrentValues.SetValues(roteiro);

            if (roteiroExistente.Etapas != null)
                _context.RoteiroProducaoEtapas.RemoveRange(roteiroExistente.Etapas);

            foreach (var etapa in novasEtapas)
            {
                etapa.RoteiroProducaoId = roteiroExistente.Id;
                _context.RoteiroProducaoEtapas.Add(etapa);
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var roteiro = await _context.RoteirosProducao.FindAsync(id);
            if (roteiro != null)
            {
                roteiro.Ativo = false;
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }
    }
}