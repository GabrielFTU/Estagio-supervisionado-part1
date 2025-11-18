using Valisys_Production.DTOs;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Threading.Tasks;
using System;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using BCrypt.Net;
using Valisys_Production.Models;

namespace Valisys_Production.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public AuthService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<(string Token, Usuario User)> LoginAsync(LoginDto loginDto)
        {
            var usuario = await _usuarioRepository.GetByEmailAsync(loginDto.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginDto.Senha, usuario.SenhaHash))
            {
                throw new UnauthorizedAccessException("Credenciais inválidas.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("fALjfDmfKT6Z2wj426wnM43R3Sc8zL92");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()), 
                    new Claim(ClaimTypes.Name, usuario.Nome),
                    new Claim(ClaimTypes.Email, usuario.Email),
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return (tokenHandler.WriteToken(token), usuario);
        }
    }
}