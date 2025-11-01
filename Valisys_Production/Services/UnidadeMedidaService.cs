using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Services
{
    public class UnidadeMedidaService : IUnidadeMedidaService
    {
        private readonly IUnidadeMedidaRepository _repository;

        public UnidadeMedidaService(IUnidadeMedidaRepository repository)
        {
            _repository = repository;
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
            return await _repository.AddAsync(unidadeMedida);
        }

        public async Task<UnidadeMedida?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da Unidade de Medida inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<UnidadeMedida>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(UnidadeMedida unidadeMedida)
        {
            if (unidadeMedida.Id == Guid.Empty)
            {
                throw new ArgumentException("ID da Unidade de Medida ausente para atualização.");
            }
            ValidateUnit(unidadeMedida);

            var existingUnidade = await _repository.GetByIdAsync(unidadeMedida.Id);
            if (existingUnidade == null)
            {
                throw new KeyNotFoundException($"Unidade de Medida com ID {unidadeMedida.Id} não encontrada.");
            }

            return await _repository.UpdateAsync(unidadeMedida);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da Unidade de Medida inválido para exclusão.");
            }

            var existingUnidade = await _repository.GetByIdAsync(id);
            if (existingUnidade == null)
            {
                return false;
            }

           
            return await _repository.DeleteAsync(id);
        }
    }
}