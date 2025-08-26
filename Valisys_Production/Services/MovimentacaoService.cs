using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Services
{
    public class MovimentacaoService : IMovimentacaoService
    {
        private readonly IMovimentacaoRepository _repository;
        public MovimentacaoService(IMovimentacaoRepository repository)
        {
            _repository = repository;
        }
        public async Task<Movimentacao> CreateAsync(Movimentacao movimentacao)
        {
            movimentacao.DataMovimentacao = DateTime.UtcNow;
            // Validação básica para garantir que a movimentação não seja nula
            if (movimentacao == null)
            {
                throw new ArgumentNullException(nameof(movimentacao), "Movimentação não pode ser nula.");
            }
            return await _repository.AddAsync(movimentacao);
        }
        public async Task<Movimentacao?> GetByIdAsync(int id)
        {
            // Validação básica para garantir que o ID seja positivo
            if (id <= 0)
            {
                throw new ArgumentException("Id invalido.", nameof(id));
            }
            return await _repository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<Movimentacao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(Movimentacao movimentacao)
        {
            // Validação básica para garantir que a movimentação não seja nula
            if (movimentacao.DataMovimentacao == default)
            {
                throw new ArgumentNullException(nameof(movimentacao), "A data da movimentação não pode ser nula.");
            }
            await _repository.UpdateAsync(movimentacao);
        }
        public async Task DeleteAsync(int id)
        {
           await _repository.DeleteAsync(id);
        }

    }
}
