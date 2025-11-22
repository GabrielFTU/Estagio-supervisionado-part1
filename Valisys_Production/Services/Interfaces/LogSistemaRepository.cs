using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.DTOs;
using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface ILogSistemaService
    {
        Task RegistrarAsync(string acao, string modulo, string detalhes, Guid? usuarioId);
        Task<IEnumerable<LogSistema>> GetAllAsync();
    }
}