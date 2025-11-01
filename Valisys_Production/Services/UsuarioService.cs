using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;


namespace Valisys_Production.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _repository;

        public UsuarioService(IUsuarioRepository repository)
        {
            _repository = repository;
        }
        public async Task<Usuario> CreateAsync(UsuarioCreateDto usuarioDto)
        {
            if (string.IsNullOrEmpty(usuarioDto.Nome) || string.IsNullOrEmpty(usuarioDto.Email))
            {
                throw new ArgumentException("O nome e o e-mail do usuário são obrigatórios.");
            }
            if (string.IsNullOrEmpty(usuarioDto.Senha))
            {
                throw new ArgumentException("A senha é obrigatória para a criação do usuário.");
            }

            var usuario = new Usuario
            {
                Nome = usuarioDto.Nome,
                Email = usuarioDto.Email,
                PerfilId = usuarioDto.PerfilId,
                Ativo = usuarioDto.Ativo,
                SenhaHash = usuarioDto.Senha
            };

            usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
            usuario.DataCadastro = DateTime.UtcNow;

            return await _repository.AddAsync(usuario);
        }

        public async Task<Usuario?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Usuário inválido.");
            }
          
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("O e-mail é obrigatório.");
            }
          
            return await _repository.GetByEmailAsync(email);
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(Usuario usuario)
        {
            if (usuario.Id == Guid.Empty)
            {
                throw new ArgumentException("ID do Usuário ausente para atualização.");
            }
            if (string.IsNullOrEmpty(usuario.Nome) || string.IsNullOrEmpty(usuario.Email))
            {
                throw new ArgumentException("O nome e o e-mail do usuário são obrigatórios.");
            }

            var existingUsuario = await _repository.GetByIdAsync(usuario.Id);
            if (existingUsuario == null)
            {
                throw new KeyNotFoundException($"Usuário com ID {usuario.Id} não encontrado.");
            }

            if (!string.IsNullOrEmpty(usuario.SenhaHash) && usuario.SenhaHash.Length > 10)
            {
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
            }
            else
            {
                usuario.SenhaHash = existingUsuario.SenhaHash;
            }

            usuario.DataCadastro = existingUsuario.DataCadastro;

            return await _repository.UpdateAsync(usuario);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Usuário inválido para exclusão.");
            }

            var existingUsuario = await _repository.GetByIdAsync(id);
            if (existingUsuario == null)
            {
                return false;
            }

            return await _repository.DeleteAsync(id);
        }
    }
}