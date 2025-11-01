using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

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
            return solicitacaoProducao;
        }

        public async Task<SolicitacaoProducao?> GetByIdAsync(Guid id)
        {
            return await _context.SolicitacoesProducao
                .AsNoTracking()
                .Include(s => s.Produto)
                .Include(s => s.Encarregado)
                .Include(s => s.Itens) 
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

        public async Task<bool> UpdateAsync(SolicitacaoProducao solicitacaoProducao)
        { 
            _context.SolicitacoesProducao.Update(solicitacaoProducao);

            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var solicitacaoProducao = await _context.SolicitacoesProducao.FindAsync(id);

            if (solicitacaoProducao != null)
            {
                _context.SolicitacoesProducao.Remove(solicitacaoProducao);
                
                return true;
            }

            return false;
        }
    }
}