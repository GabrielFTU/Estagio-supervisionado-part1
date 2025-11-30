using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Services
{
    public class LogSistemaService : ILogSistemaService
    {
        private readonly ILogSistemaRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LogSistemaService(ILogSistemaRepository repository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task RegistrarAsync(string acao, string modulo, string detalhes, Guid? usuarioId = null)
        {
            if (!usuarioId.HasValue)
            {
                var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var id))
                {
                    usuarioId = id;
                }
            }

            var log = new LogSistema
            {
                Acao = acao,
                Modulo = modulo,
                Detalhes = detalhes,
                UsuarioId = usuarioId,
                DataHora = DateTime.UtcNow
            };

            await _repository.AddAsync(log);
        }

        public async Task<IEnumerable<LogSistema>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
    }
}