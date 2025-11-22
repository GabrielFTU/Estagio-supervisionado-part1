using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Services
{
    public class MovimentacaoService : IMovimentacaoService
    {
        private readonly IMovimentacaoRepository _repository;

        public MovimentacaoService(IMovimentacaoRepository repository)
        {
            _repository = repository;
        }

        public async Task<Movimentacao> CreateAsync(MovimentacaoCreateDto movimentacaoDto, Guid usuarioId)
        {
            if (movimentacaoDto == null)
            {
                throw new ArgumentNullException(nameof(movimentacaoDto), "O objeto DTO não pode ser nulo.");
            }
            if (usuarioId == Guid.Empty)
            {
                throw new ArgumentException("O ID do usuário é obrigatório para a criação da movimentação.", nameof(usuarioId));
            }

            var movimentacao = new Movimentacao
            {
                ProdutoId = movimentacaoDto.ProdutoId,
                Quantidade = movimentacaoDto.Quantidade,
                AlmoxarifadoOrigemId = movimentacaoDto.AlmoxarifadoOrigemId,
                AlmoxarifadoDestinoId = movimentacaoDto.AlmoxarifadoDestinoId,
                UsuarioId = usuarioId,
                DataMovimentacao = DateTime.UtcNow
            };

            if (movimentacaoDto.OrdemDeProducaoId.HasValue)
            {
                movimentacao.OrdemDeProducaoId = movimentacaoDto.OrdemDeProducaoId.Value;
            }

            return await _repository.AddAsync(movimentacao);
        }

        public async Task<Movimentacao?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da movimentação inválido.", nameof(id));
            }

            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Movimentacao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(Movimentacao movimentacao)
        {
            if (movimentacao == null)
            {
                throw new ArgumentNullException(nameof(movimentacao), "O objeto Movimentação não pode ser nulo.");
            }
            if (movimentacao.Id == Guid.Empty)
            {
                throw new ArgumentException("ID da movimentação é obrigatório para atualização.", nameof(movimentacao.Id));
            }
            var existingMovimentacao = await _repository.GetByIdAsync(movimentacao.Id);
            if (existingMovimentacao == null)
            {
                throw new KeyNotFoundException($"Movimentação com ID {movimentacao.Id} não encontrada para atualização.");
            }
            movimentacao.DataMovimentacao = existingMovimentacao.DataMovimentacao;
            movimentacao.UsuarioId = existingMovimentacao.UsuarioId;

            return await _repository.UpdateAsync(movimentacao);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da movimentação inválido.", nameof(id));
            }

            var success = await _repository.DeleteAsync(id);

            if (!success)
            {
                throw new KeyNotFoundException($"Movimentação com ID {id} não encontrada para exclusão.");
            }

            return true;
        }
    }
}