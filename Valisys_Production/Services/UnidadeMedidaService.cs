// Services/UnidadeMedidaService.cs

using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Services
{
    public class UnidadeMedidaService : IUnidadeMedidaService
    {
        private readonly IUnidadeMedidaRepository _repository;

        public UnidadeMedidaService(IUnidadeMedidaRepository repository)
        {
            _repository = repository;
        }

        public async Task<UnidadeMedida> CreateAsync(UnidadeMedida unidadeMedida)
        {
            if (string.IsNullOrEmpty(unidadeMedida.Nome) || string.IsNullOrEmpty(unidadeMedida.Nome))
            {
                throw new ArgumentException("Nome e sigla da unidade de medida são obrigatórios.");
            }
            return await _repository.AddAsync(unidadeMedida);
        }

        public async Task<UnidadeMedida?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<UnidadeMedida>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(UnidadeMedida unidadeMedida)
        {
            if (string.IsNullOrEmpty(unidadeMedida.Nome) || string.IsNullOrEmpty(unidadeMedida.Nome))
            {
                throw new ArgumentException("Nome e sigla da unidade de medida são obrigatórios.");
            }
            await _repository.UpdateAsync(unidadeMedida);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}