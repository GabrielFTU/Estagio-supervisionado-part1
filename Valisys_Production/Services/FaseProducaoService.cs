using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Services
{
    public class FaseProducaoService : IFaseProducaoService
    {
        private readonly IFaseProducaoRepository _repository;

        public FaseProducaoService(IFaseProducaoRepository repository)
        {
            _repository = repository;
        }

        public async Task<FaseProducao> CreateAsync(FaseProducao faseProducao)
        {
            if (string.IsNullOrEmpty(faseProducao.Nome))
            {
                throw new ArgumentException("O nome da fase de produção é obrigatório.");
            }
            return await _repository.AddAsync(faseProducao);
        }

        public async Task<FaseProducao?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<FaseProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(FaseProducao faseProducao)
        {
            if (string.IsNullOrEmpty(faseProducao.Nome))
            {
                throw new ArgumentException("O nome da fase de produção é obrigatório.");
            }
            await _repository.UpdateAsync(faseProducao);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}