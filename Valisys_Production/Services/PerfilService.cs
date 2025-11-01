using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Services
{
    public class PerfilService : IPerfilService
    {
        private readonly IPerfilRepository _repository;

        public PerfilService(IPerfilRepository repository)
        {
            _repository = repository;
        }

        public async Task<Perfil> CreateAsync(Perfil perfil)
        {
            if (string.IsNullOrEmpty(perfil.Nome))
            {
                throw new ArgumentException("O nome do perfil não pode ser vazio.");
            }
            return await _repository.AddAsync(perfil);
        }

        public async Task<Perfil?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Perfil inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Perfil>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(Perfil perfil)
        {
            if (perfil.Id == Guid.Empty)
            {
                throw new ArgumentException("ID do Perfil ausente para atualização.");
            }
            if (string.IsNullOrEmpty(perfil.Nome))
            {
                throw new ArgumentException("O nome do perfil não pode ser vazio.");
            }

            var existingPerfil = await _repository.GetByIdAsync(perfil.Id);
            if (existingPerfil == null)
            {
                throw new KeyNotFoundException($"Perfil com ID {perfil.Id} não encontrado.");
            }

            return await _repository.UpdateAsync(perfil);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Perfil inválido para exclusão.");
            }

            var existingPerfil = await _repository.GetByIdAsync(id);
            if (existingPerfil == null)
            {
                return false;
            }

          

            return await _repository.DeleteAsync(id);
        }
    }
}