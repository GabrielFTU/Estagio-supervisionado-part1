using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimentacaoController : ControllerBase
    {
        private readonly IMovimentacaoService _service;

        public MovimentacaoController(IMovimentacaoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movimentacao>>> GetAll()
        {
            var movimentacoes = await _service.GetAllAsync();
            return Ok(movimentacoes);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Movimentacao>> GetById(int id)
        {
            var movimentacao = await _service.GetByIdAsync(id);
            if (movimentacao == null)
            {
                return NotFound();
            }
            return Ok(movimentacao);
        }
        [HttpPost]
        public async Task<ActionResult<Movimentacao>> PostMovimentacao(Movimentacao movimentacao)
        {
            var newMovimentacao = await _service.CreateAsync(movimentacao);
            return CreatedAtAction(nameof(GetById), new { id = newMovimentacao.Id }, newMovimentacao);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovimentacao(int id, Movimentacao movimentacao)
        {
            if (id != movimentacao.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(movimentacao);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovimentacao(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
