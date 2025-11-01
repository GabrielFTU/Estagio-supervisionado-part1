using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.Models;

namespace Valisys_Production.Services
{
    public class AlmoxarifadoService : IAlmoxarifadoService
    {
        private readonly IAlmoxarifadoRepository _repository;

        public AlmoxarifadoService(IAlmoxarifadoRepository repository)
        {
            _repository = repository;
        }

        public async Task<Almoxarifado> CreateAsync(Almoxarifado almoxarifado)
        {
            if (string.IsNullOrEmpty(almoxarifado.Nome))
            {
                throw new ArgumentException("O nome do almoxarifado não pode ser vazio.");
            }

            almoxarifado.DataCadastro = DateTime.UtcNow;

            return await _repository.AddAsync(almoxarifado);
        }

        public async Task<Almoxarifado?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Almoxarifado inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Almoxarifado>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(Almoxarifado almoxarifado)
        {
            if (almoxarifado.Id == Guid.Empty)
            {
                throw new ArgumentException("ID do Almoxarifado ausente para atualização.");
            }
            if (string.IsNullOrEmpty(almoxarifado.Nome))
            {
                throw new ArgumentException("O nome do almoxarifado não pode ser vazio.");
            }

            var existingAlmoxarifado = await _repository.GetByIdAsync(almoxarifado.Id);
            if (existingAlmoxarifado == null)
            {
                throw new KeyNotFoundException($"Almoxarifado com ID {almoxarifado.Id} não encontrado.");
            }

            return await _repository.UpdateAsync(almoxarifado);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Almoxarifado inválido para exclusão.");
            }

            var existingAlmoxarifado = await _repository.GetByIdAsync(id);
            if (existingAlmoxarifado == null)
            {
                return false;
            }

            return await _repository.DeleteAsync(id);
        }
    }
}