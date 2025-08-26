using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Services
{
    public class TipoOrdemDeProducaoService : ITipoOrdemDeProducaoService
    {
        private readonly ITipoOrdemDeProducaoRepository _repository;

        public TipoOrdemDeProducaoService(ITipoOrdemDeProducaoRepository repository)
        {
            _repository = repository;
        }

        public async Task<TipoOrdemDeProducao> CreateAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            if (string.IsNullOrEmpty(tipoOrdemDeProducao.Nome))
            {
                throw new ArgumentException("O nome do tipo de ordem de produção é obrigatório.");
            }
            return await _repository.AddAsync(tipoOrdemDeProducao);
        }

        public async Task<TipoOrdemDeProducao?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<TipoOrdemDeProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            if (string.IsNullOrEmpty(tipoOrdemDeProducao.Nome))
            {
                throw new ArgumentException("O nome do tipo de ordem de produção é obrigatório.");
            }
            await _repository.UpdateAsync(tipoOrdemDeProducao);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}