using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Services
{
    public class LoteService : ILoteService
    {
        private readonly ILoteRepository _repository;

        public LoteService(ILoteRepository repository)
        {
            _repository = repository;
        }

        public async Task<Lote> CreateAsync(LoteCreateDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "O DTO do lote não pode ser nulo.");
            if (string.IsNullOrEmpty(dto.CodigoLote))
                throw new ArgumentException("O número do lote é obrigatório.");

            var lote = new Lote
            {
                CodigoLote = dto.CodigoLote,
                Descricao = dto.Descricao ?? string.Empty,
                Observacoes = dto.Observacoes ?? string.Empty,
                ProdutoId = dto.ProdutoId,
                AlmoxarifadoId = dto.AlmoxarifadoId,
                DataAbertura = DateTime.UtcNow
            };

            lote.statusLote = StatusLote.Pendente;

            return await _repository.AddAsync(lote);
        }

        public async Task<Lote?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Lote inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Lote>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(Lote lote)
        {
            if (lote.Id == Guid.Empty)
            {
                throw new ArgumentException("ID do Lote ausente para atualização.");
            }
            if (string.IsNullOrEmpty(lote.CodigoLote))
            {
                throw new ArgumentException("O número do lote não pode ser vazio.");
            }

            var existingLote = await _repository.GetByIdAsync(lote.Id);
            if (existingLote == null)
            {
                throw new KeyNotFoundException($"Lote com ID {lote.Id} não encontrado.");
            }

            if (existingLote.statusLote == StatusLote.Concluido)
            {
                throw new InvalidOperationException("Não é permitido editar um lote que já foi Concluído (Estoque gerado).");
            }

            lote.statusLote = existingLote.statusLote;

            lote.Observacoes ??= string.Empty;
            lote.Descricao ??= string.Empty;
            lote.DataAbertura = existingLote.DataAbertura;
            if (existingLote.DataConclusao.HasValue)
            {
                lote.DataConclusao = existingLote.DataConclusao;
            }

            return await _repository.UpdateAsync(lote);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Lote inválido para exclusão.");
            }

            var existingLote = await _repository.GetByIdAsync(id);
            if (existingLote == null)
            {
                return false;
            }

            if (existingLote.statusLote != StatusLote.Pendente && existingLote.statusLote != StatusLote.Cancelado)
            {
                throw new InvalidOperationException($"Lote com status '{existingLote.statusLote}' não pode ser excluído.");
            }

            return await _repository.DeleteAsync(id);
        }
    }
}