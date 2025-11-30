using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services
{
    public class TipoOrdemDeProducaoService : ITipoOrdemDeProducaoService
    {
        private readonly ITipoOrdemDeProducaoRepository _repository;
        private readonly ILogSistemaService _logService;

        public TipoOrdemDeProducaoService(ITipoOrdemDeProducaoRepository repository, ILogSistemaService logService)
        {
            _repository = repository;
            _logService = logService;
        }

        public async Task<TipoOrdemDeProducao> CreateAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            if (string.IsNullOrEmpty(tipoOrdemDeProducao.Nome))
            {
                throw new ArgumentException("O nome do tipo de ordem de produção é obrigatório.");
            }
            
            var created = await _repository.AddAsync(tipoOrdemDeProducao);
            
            await _logService.RegistrarAsync(
                "Criação", 
                "Tipos de OP", 
                $"Criou o tipo de OP '{created.Nome}'"
            );

            return created;
        }

        public async Task<TipoOrdemDeProducao?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty) throw new ArgumentException("ID inválido.");
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<TipoOrdemDeProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            if (tipoOrdemDeProducao.Id == Guid.Empty) throw new ArgumentException("ID ausente.");

            var existingTipo = await _repository.GetByIdAsync(tipoOrdemDeProducao.Id);
            if (existingTipo == null) throw new KeyNotFoundException("Tipo de OP não encontrado.");

            var updated = await _repository.UpdateAsync(tipoOrdemDeProducao);

            if (updated)
            {
                await _logService.RegistrarAsync(
                    "Edição", 
                    "Tipos de OP", 
                    $"Editou o tipo de OP '{tipoOrdemDeProducao.Nome}'"
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
                    "Tipos de OP", 
                    $"Excluiu o tipo de OP '{existing.Nome}'"
                );
            }

            return deleted;
        }
    }
}