using Microsoft.EntityFrameworkCore;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Repositories
{
    public class AlmoxarifadoRepository : IAlmoxarifadoRepository
    {
        private readonly ApplicationDbContext _context;

        public AlmoxarifadoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Almoxarifado> AddAsync(Almoxarifado almoxarifado)
        {
            _context.Almoxarifados.Add(almoxarifado);
            await _context.SaveChangesAsync();
            return almoxarifado;
        }

        public async Task<Almoxarifado?> GetByIdAsync(Guid id)
        {
            return await _context.Almoxarifados.FindAsync(id);
        }

        public async Task<IEnumerable<Almoxarifado>> GetAllAsync()
        {
            return await _context.Almoxarifados.AsNoTracking().ToListAsync();
        }

        public async Task<bool> UpdateAsync(Almoxarifado almoxarifado)
        {
            var existing = await _context.Almoxarifados.FindAsync(almoxarifado.Id);
            if (existing == null) return false;

            existing.Nome = almoxarifado.Nome;
            existing.Descricao = almoxarifado.Descricao;
            existing.Localizacao = almoxarifado.Localizacao;
            existing.Responsavel = almoxarifado.Responsavel;
            existing.Contato = almoxarifado.Contato;
            existing.Email = almoxarifado.Email;
            existing.Ativo = almoxarifado.Ativo; 

            _context.Entry(existing).State = EntityState.Modified;

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
            var almoxarifado = await _context.Almoxarifados.FindAsync(id);

            if (almoxarifado != null)
            {
                almoxarifado.Ativo = false;
                _context.Entry(almoxarifado).State = EntityState.Modified;
                
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0;
            }

            return false;
        }
    }
}