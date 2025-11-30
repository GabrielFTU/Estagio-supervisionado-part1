using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services
{
    public class FaseProducaoService : IFaseProducaoService
    {
        private readonly IFaseProducaoRepository _repository;
        private readonly ILogSistemaService _logService;

        public FaseProducaoService(IFaseProducaoRepository repository, ILogSistemaService logService)
        {
            _repository = repository;
            _logService = logService;
        }

        public async Task<FaseProducao> CreateAsync(FaseProducao faseProducao)
        {
            if (string.IsNullOrEmpty(faseProducao.Nome))
                throw new ArgumentException("O nome da fase de produção é obrigatório.");

            var created = await _repository.AddAsync(faseProducao);

            await _logService.RegistrarAsync(
                "Criação", 
                "Fases de Produção", 
                $"Criou a fase '{created.Nome}' (Ordem: {created.Ordem})"
            );

            return created;
        }

        public async Task<FaseProducao?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty) throw new ArgumentException("ID inválido.");
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<FaseProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(FaseProducao faseProducao)
        {
            if (faseProducao.Id == Guid.Empty) throw new ArgumentException("ID ausente.");

            var existingFase = await _repository.GetByIdAsync(faseProducao.Id);
            if (existingFase == null) throw new KeyNotFoundException("Fase de Produção não encontrada.");

            var updated = await _repository.UpdateAsync(faseProducao);

            if (updated)
            {
                await _logService.RegistrarAsync(
                    "Edição", 
                    "Fases de Produção", 
                    $"Editou a fase '{faseProducao.Nome}'"
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
                    "Fases de Produção", 
                    $"Excluiu a fase '{existing.Nome}'"
                );
            }

            return deleted;
        }
    }
}