using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SolicitacoesProducaoController : ControllerBase
    {
        private readonly ISolicitacaoProducaoService _service;

        public SolicitacoesProducaoController(ISolicitacaoProducaoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SolicitacaoProducao>>> GetAll()
        {
            var solicitacoes = await _service.GetAllAsync();
            return Ok(solicitacoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SolicitacaoProducao>> GetById(int id)
        {
            var solicitacao = await _service.GetByIdAsync(id);
            if (solicitacao == null)
            {
                return NotFound();
            }
            return Ok(solicitacao);
        }

        [HttpPost]
        public async Task<ActionResult<SolicitacaoProducao>> PostSolicitacaoProducao(SolicitacaoProducao solicitacaoProducao)
        {
            var newSolicitacao = await _service.CreateAsync(solicitacaoProducao);
            return CreatedAtAction(nameof(GetById), new { id = newSolicitacao.Id }, newSolicitacao);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSolicitacaoProducao(int id, SolicitacaoProducao solicitacaoProducao)
        {
            if (id != solicitacaoProducao.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(solicitacaoProducao);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSolicitacaoProducao(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        [HttpPost("{solicitacaoId}/aprovar")]
        public async Task<ActionResult<List<OrdemDeProducao>>> AprovarSolicitacao(int solicitacaoId, [FromQuery] int usuarioAprovadorId)

        {
            try
            {
                var ordensGeradas = await _service.AprovarSolicitacaoAsync(solicitacaoId, usuarioAprovadorId);
                return Ok(ordensGeradas);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}