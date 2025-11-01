using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;

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

        public async Task<FaseProducao?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da Fase de Produção inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<FaseProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(FaseProducao faseProducao)
        {
            if (faseProducao.Id == Guid.Empty)
            {
                throw new ArgumentException("ID da Fase de Produção ausente para atualização.");
            }
            if (string.IsNullOrEmpty(faseProducao.Nome))
            {
                throw new ArgumentException("O nome da fase de produção é obrigatório.");
            }

            var existingFase = await _repository.GetByIdAsync(faseProducao.Id);
            if (existingFase == null)
            {
                throw new KeyNotFoundException($"Fase de Produção com ID {faseProducao.Id} não encontrada.");
            }

            return await _repository.UpdateAsync(faseProducao);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da Fase de Produção inválido para exclusão.");
            }

            var existingFase = await _repository.GetByIdAsync(id);
            if (existingFase == null)
            {
                return false;
            }

            return await _repository.DeleteAsync(id);
        }
    }
}