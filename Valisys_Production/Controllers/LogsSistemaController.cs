using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Valisys_Production.DTOs;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsSistemaController : ControllerBase
    {
        private readonly ILogSistemaService _service;

        public LogsSistemaController(ILogSistemaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogSistemaReadDto>>> GetAll()
        {
            var logs = await _service.GetAllAsync();

            var dtos = logs.Select(l => new LogSistemaReadDto
            {
                Id = l.Id,
                UsuarioId = l.UsuarioId,
                UsuarioNome = l.Usuario?.Nome ?? "Sistema",
                Acao = l.Acao,
                Modulo = l.Modulo,
                Detalhes = l.Detalhes,
                DataHora = l.DataHora
            });

            return Ok(dtos);
        }
    }
}