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
            if (lote.Quantidade <= 0)
            {
                throw new ArgumentException("A quantidade do lote deve ser maior que zero.");
            }

            // Define o status inicial e a data de início
            lote.Status = StatusLote.EmProducao;
            lote.DataInicio = DateTime.Now;
            lote.DataCadastro = DateTime.Now;

            return await _repository.AddAsync(lote);
        }

        public async Task<Lote> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Lote>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(Lote lote)
        {
            if (lote.Quantidade <= 0)
            {
                throw new ArgumentException("A quantidade do lote deve ser maior que zero.");
            }
            await _repository.UpdateAsync(lote);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}