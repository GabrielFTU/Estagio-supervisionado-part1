using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BCrypt.Net;

namespace Valisys_Production.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _repository;
    
        public UsuarioService(IUsuarioRepository repository)
        {
            _repository = repository;
        }
        public async Task<Usuario> CreateAsync(Usuario usuario)
        {
           if(string.IsNullOrEmpty(usuario.Nome)) 
                          {
               throw new ArgumentException("O Nome do usuario é obrigatório.");
            }

           usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
           return await _repository.AddAsync(usuario);
        }
        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(Usuario usuario)
        {
            if (string.IsNullOrEmpty(usuario.Nome))
            {
                throw new ArgumentException("O Nome do usuario é obrigatório.");
            }
            if (!string.IsNullOrEmpty(usuario.SenhaHash))
            {
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
            }
            await _repository.UpdateAsync(usuario);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
