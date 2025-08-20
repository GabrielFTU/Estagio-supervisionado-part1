using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public async Task<Perfil?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<Perfil>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
        public async Task UpdateAsync(Perfil perfil)
        {
            if (string.IsNullOrEmpty(perfil.Nome))
            {
                throw new ArgumentException("O nome do perfil não pode ser vazio.");
            }
            await _repository.UpdateAsync(perfil);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
