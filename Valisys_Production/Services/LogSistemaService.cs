using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Services
{
    public class LogSistemaService : ILogSistemaService
    {
        private readonly ILogSistemaRepository _repository;

        public LogSistemaService(ILogSistemaRepository repository)
        {
            _repository = repository;
        }

        public async Task RegistrarAsync(string acao, string modulo, string detalhes, Guid? usuarioId)
        {
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