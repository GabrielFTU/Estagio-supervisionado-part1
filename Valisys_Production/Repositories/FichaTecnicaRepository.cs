using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace Valisys_Production.Repositories
{
    public class FichaTecnicaRepository : IFichaTecnicaRepository
    {
        private readonly ApplicationDbContext _context;

        public FichaTecnicaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FichaTecnica> AddAsync(FichaTecnica fichaTecnica)
        {
            _context.FichasTecnicas.Add(fichaTecnica);
            await _context.SaveChangesAsync();
            return fichaTecnica;
        }

        public async Task<FichaTecnica?> GetByIdAsync(Guid id)
        {
            return await _context.FichasTecnicas
                .AsNoTracking()
                .Include(f => f.Produto)
                .Include(f => f.Itens)
                    .ThenInclude(i => i.ProdutoComponente)
                        .ThenInclude(p => p.UnidadeMedida)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<IEnumerable<FichaTecnica>> GetAllAsync()
        {
            return await _context.FichasTecnicas
                .AsNoTracking()
                .Include(f => f.Produto)
                .OrderBy(f => f.Produto.Nome)
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(FichaTecnica fichaTecnica)
        {
            _context.Entry(fichaTecnica).State = EntityState.Modified;
            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
        }

        public async Task<bool> UpdateWithItemsAsync(FichaTecnica ficha, List<FichaTecnicaItem> novosItens)
        {
            var fichaExistente = await _context.FichasTecnicas
                .Include(f => f.Itens)
                .FirstOrDefaultAsync(f => f.Id == ficha.Id);

            if (fichaExistente == null) return false;

            _context.Entry(fichaExistente).CurrentValues.SetValues(ficha);

            if (fichaExistente.Itens != null)
            {
                _context.FichaTecnicaItens.RemoveRange(fichaExistente.Itens);
            }

            foreach (var item in novosItens)
            {
                item.FichaTecnicaId = fichaExistente.Id; 
                _context.FichaTecnicaItens.Add(item);
            }

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var ficha = await _context.FichasTecnicas.FindAsync(id);

            if (ficha != null)
            {
                ficha.Ativa = false;
                _context.Entry(ficha).State = EntityState.Modified;
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }
    }
}