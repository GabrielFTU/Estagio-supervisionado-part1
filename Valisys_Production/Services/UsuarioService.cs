using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _repository;
        private readonly ILogSistemaService _logService;

        public UsuarioService(IUsuarioRepository repository, ILogSistemaService logService)
        {
            _repository = repository;
            _logService = logService;
        }

        public async Task<Usuario> CreateAsync(UsuarioCreateDto usuarioDto)
        {
            if (string.IsNullOrEmpty(usuarioDto.Nome) || string.IsNullOrEmpty(usuarioDto.Email))
                throw new ArgumentException("Dados obrigatórios faltando.");

            var usuario = new Usuario
            {
                Nome = usuarioDto.Nome,
                Email = usuarioDto.Email,
                PerfilId = usuarioDto.PerfilId,
                Ativo = usuarioDto.Ativo,
                SenhaHash = usuarioDto.Senha,
                DataCadastro = DateTime.UtcNow
            };

            usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
            
            var created = await _repository.AddAsync(usuario);

            await _logService.RegistrarAsync("Criação", "Usuários", $"Criou novo usuário: {created.Email}");

            return created;
        }

        public async Task<Usuario?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty) throw new ArgumentException("ID inválido.");
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            return await _repository.GetByEmailAsync(email);
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(Usuario usuario)
        {
            var existing = await _repository.GetByIdAsync(usuario.Id);
            if (existing == null) throw new KeyNotFoundException("Usuário não encontrado.");

            if (!string.IsNullOrEmpty(usuario.SenhaHash) && usuario.SenhaHash.Length > 10)
            {
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
                await _logService.RegistrarAsync("Segurança", "Usuários", $"Alterou a senha do usuário: {existing.Email}");
            }
            else
            {
                usuario.SenhaHash = existing.SenhaHash;
            }

            usuario.DataCadastro = existing.DataCadastro;
            var result = await _repository.UpdateAsync(usuario);

            if (result)
            {
                await _logService.RegistrarAsync("Edição", "Usuários", $"Atualizou perfil do usuário: {usuario.Email}");
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
                await _logService.RegistrarAsync("Exclusão", "Usuários", $"Removeu o usuário: {existing.Email}");
            }

            return result;
        }
    }
}