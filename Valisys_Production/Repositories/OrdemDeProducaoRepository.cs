using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Repositories
{
    public class OrdemDeProducaoRepository : IOrdemDeProducaoRepository
    {
        private readonly ApplicationDbContext _context;
        public OrdemDeProducaoRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<OrdemDeProducao> AddAsync(OrdemDeProducao ordemDeProducao)
        {
            _context.OrdensDeProducao.Add(ordemDeProducao);
            await _context.SaveChangesAsync();
            return ordemDeProducao;
        }
        public async Task<OrdemDeProducao?> GetByIdAsync(int id)
        {
            return await _context.OrdensDeProducao
                .AsNoTracking()
                .Include(o => o.Lote)
                .Include(o => o.Produto)
                .Include(o => o.Almoxarifado)
                .Include(o => o.FaseAtual)
                .Include(o => o.TipoOrdemDeProducao)
                .FirstOrDefaultAsync(o => o.Id == id);
        }
        public async Task<IEnumerable<OrdemDeProducao>> GetAllAsync()
        {
            return await _context.OrdensDeProducao
                .AsNoTracking()
                .Include(o => o.Lote)
                .Include(o => o.Produto)
                .Include(o => o.Almoxarifado)
                .Include(o => o.FaseAtual)
                .Include(o => o.TipoOrdemDeProducao)
                .ToListAsync();
        }
        public async Task UpdateAsync(OrdemDeProducao ordemDeProducao)
        {
            _context.OrdensDeProducao.Update(ordemDeProducao);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var ordemDeProducao = await _context.OrdensDeProducao.FindAsync(id);
            if (ordemDeProducao != null)
            {
                _context.OrdensDeProducao.Remove(ordemDeProducao);
                await _context.SaveChangesAsync();
            }
        }
    }
}