using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services
{
    public class LoteService : ILoteService
    {
        private readonly ILoteRepository _repository;
        private readonly ILogSistemaService _logService;

        public LoteService(ILoteRepository repository, ILogSistemaService logService)
        {
            _repository = repository;
            _logService = logService;
        }

        public async Task<Lote> CreateAsync(LoteCreateDto dto)
        {
            if (string.IsNullOrEmpty(dto.CodigoLote))
                throw new ArgumentException("Código do lote obrigatório.");

            var lote = new Lote
            {
                CodigoLote = dto.CodigoLote,
                Descricao = dto.Descricao ?? string.Empty,
                Observacoes = dto.Observacoes ?? string.Empty,
                ProdutoId = dto.ProdutoId,
                AlmoxarifadoId = dto.AlmoxarifadoId,
                DataAbertura = DateTime.UtcNow,
                statusLote = StatusLote.Pendente
            };

            var created = await _repository.AddAsync(lote);

            await _logService.RegistrarAsync("Criação", "Lotes", $"Registrou novo Lote: {created.CodigoLote}");

            return created;
        }

        public async Task<Lote?> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);
        public async Task<IEnumerable<Lote>> GetAllAsync() => await _repository.GetAllAsync();

        public async Task<bool> UpdateAsync(Lote lote)
        {
            var existing = await _repository.GetByIdAsync(lote.Id);
            if (existing == null) throw new KeyNotFoundException("Lote não encontrado.");

            // Mantém dados sensíveis originais
            lote.statusLote = existing.statusLote;
            lote.DataAbertura = existing.DataAbertura;
            lote.DataConclusao = existing.DataConclusao;

            var result = await _repository.UpdateAsync(lote);

            if (result)
            {
                await _logService.RegistrarAsync("Edição", "Lotes", $"Atualizou dados do Lote: {lote.CodigoLote}");
            }

            return result;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;

            var result = await _repository.DeleteAsync(id);
            if (result)
            {
                await _logService.RegistrarAsync("Exclusão", "Lotes", $"Excluiu o Lote: {existing.CodigoLote}");
            }
            return result;
        }
    }
}