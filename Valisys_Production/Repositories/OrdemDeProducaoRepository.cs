using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.DTOs;

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
                    .ThenInclude(p => p.UnidadeMedida)
                .Include(o => o.Almoxarifado)
                .Include(o => o.FaseAtual)
                .Include(o => o.TipoOrdemDeProducao)
                .Include(o => o.RoteiroProducao)
                .FirstOrDefaultAsync(o => o.Id == id);
        }
        public async Task<IEnumerable<OrdemDeProducaoReadDto>> GetAllReadDtosAsync()
        {
            return await _context.OrdensDeProducao
                .AsNoTracking()
                .OrderByDescending(o => o.DataInicio)
                .Take(80) 
                .Select(o => new OrdemDeProducaoReadDto
                {
                    Id = o.Id,
                    CodigoOrdem = o.CodigoOrdem,
                    Quantidade = o.Quantidade,
                    Status = o.Status,
                    DataInicio = o.DataInicio,
                    DataFim = o.DataFim,
                    Observacoes = o.Observacoes,

                    ProdutoId = o.ProdutoId,
                    ProdutoNome = o.Produto.Nome,

                    AlmoxarifadoId = o.AlmoxarifadoId,
                    AlmoxarifadoNome = o.Almoxarifado.Nome,

                    FaseAtualId = o.FaseAtualId,
                    FaseAtualNome = o.FaseAtual.Nome,

                    LoteId = o.LoteId,
                    LoteNumero = o.Lote != null ? o.Lote.CodigoLote : null,

                    RoteiroProducaoId = o.RoteiroProducaoId,
                    RoteiroCodigo = o.RoteiroProducao != null ? o.RoteiroProducao.Codigo : null
                })
                .ToListAsync();
        }

        public async Task<OrdemDeProducao?> GetByCodigoAsync(string codigo)
        {
            return await _context.OrdensDeProducao
                .AsNoTracking()
                .Include(o => o.Lote)
                .Include(o => o.Produto)
                .Include(o => o.FaseAtual)
                .Include(o => o.RoteiroProducao)
                .FirstOrDefaultAsync(o => o.CodigoOrdem == codigo);
        }

        public async Task<IEnumerable<OrdemDeProducao>> GetAllAsync()
        {
            return await _context.OrdensDeProducao
                .AsNoTracking()
                .Include(o => o.Produto)
                .Include(o => o.FaseAtual)
                .Include(o => o.Almoxarifado)
                .OrderByDescending(o => o.DataInicio)
                .Take(100)
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(OrdemDeProducao ordemDeProducao)
        {
            _context.OrdensDeProducao.Update(ordemDeProducao);
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
            var ordem = await _context.OrdensDeProducao.FindAsync(id);
            if (ordem == null) return false;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var movimentacoes = await _context.Movimentacoes
                    .Where(m => m.OrdemDeProducaoId == id)
                    .ToListAsync();

                if (movimentacoes.Any())
                    _context.Movimentacoes.RemoveRange(movimentacoes);

                _context.OrdensDeProducao.Remove(ordem);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}