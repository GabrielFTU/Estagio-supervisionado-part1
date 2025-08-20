using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Services
{
    public class LoteService : ILoteService
    {
        private readonly ILoteRepository _repository;

        public LoteService(ILoteRepository repository)
        {
            _repository = repository;
        }

        public async Task<Lote> CreateAsync(Lote lote)
        {
            lote.statusLote = StatusLote.Pendente;
            lote.DataAbertura = DateTime.UtcNow;
            lote.DataAbertura = DateTime.UtcNow;

            return await _repository.AddAsync(lote);
        }

        public async Task<Lote?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Lote>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(Lote lote)
        {
            await _repository.UpdateAsync(lote);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}