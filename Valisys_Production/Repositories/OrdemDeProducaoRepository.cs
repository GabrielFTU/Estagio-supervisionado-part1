using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq; // Necessário para o Where e Any

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

        public async Task<OrdemDeProducao?> GetByIdAsync(Guid id)
        {
            return await _context.OrdensDeProducao
                .AsNoTracking()
                .Include(o => o.Lote)
                .Include(o => o.Produto)
                .Include(o => o.Almoxarifado)
                .Include(o => o.FaseAtual)
                .Include(o => o.TipoOrdemDeProducao)
                .Include(o => o.RoteiroProducao)
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
                .Include(o => o.RoteiroProducao)
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(OrdemDeProducao ordemDeProducao)
        {
            _context.OrdensDeProducao.Update(ordemDeProducao);

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
            var ordemDeProducao = await _context.OrdensDeProducao.FindAsync(id);

            if (ordemDeProducao == null)
            {
                return false;
            }

            var movimentacoesVinculadas = await _context.Movimentacoes
                .Where(m => m.OrdemDeProducaoId == id)
                .ToListAsync();

            if (movimentacoesVinculadas.Any())
            {
                _context.Movimentacoes.RemoveRange(movimentacoesVinculadas);
            }

            _context.OrdensDeProducao.Remove(ordemDeProducao);

            try
            {
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}