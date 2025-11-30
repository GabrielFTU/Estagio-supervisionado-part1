using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services
{
    public class UnidadeMedidaService : IUnidadeMedidaService
    {
        private readonly IUnidadeMedidaRepository _repository;
        private readonly ILogSistemaService _logService;

        public UnidadeMedidaService(IUnidadeMedidaRepository repository, ILogSistemaService logService)
        {
            _repository = repository;
            _logService = logService;
        }

        private void ValidateUnit(UnidadeMedida unidadeMedida)
        {
            if (string.IsNullOrEmpty(unidadeMedida.Nome) || string.IsNullOrEmpty(unidadeMedida.Sigla))
            {
                throw new ArgumentException("Nome e sigla da unidade de medida são obrigatórios.");
            }
        }

        public async Task<UnidadeMedida> CreateAsync(UnidadeMedida unidadeMedida)
        {
            ValidateUnit(unidadeMedida);
            var created = await _repository.AddAsync(unidadeMedida);

            await _logService.RegistrarAsync(
                "Criação", 
                "Unidades de Medida", 
                $"Criou unidade '{created.Nome}' ({created.Sigla})"
            );

            return created;
        }

        public async Task<UnidadeMedida?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty) throw new ArgumentException("ID inválido.");
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<UnidadeMedida>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(UnidadeMedida unidadeMedida)
        {
            if (unidadeMedida.Id == Guid.Empty) throw new ArgumentException("ID ausente.");
            ValidateUnit(unidadeMedida);

            var existingUnidade = await _repository.GetByIdAsync(unidadeMedida.Id);
            if (existingUnidade == null) throw new KeyNotFoundException("Unidade de Medida não encontrada.");

            var updated = await _repository.UpdateAsync(unidadeMedida);

            if (updated)
            {
                await _logService.RegistrarAsync(
                    "Edição", 
                    "Unidades de Medida", 
                    $"Editou unidade '{unidadeMedida.Nome}' ({unidadeMedida.Sigla})"
                );
            }

            return updated;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;

            var deleted = await _repository.DeleteAsync(id);

            if (deleted)
            {
                await _logService.RegistrarAsync(
                    "Exclusão", 
                    "Unidades de Medida", 
                    $"Excluiu unidade '{existing.Nome}'"
                );
            }

            return deleted;
        }
    }
}