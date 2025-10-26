using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LotesController : ControllerBase
    {
        private readonly ILoteService _service;

        public LotesController(ILoteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lote>>> GetAll()
        {
            var lotes = await _service.GetAllAsync();
            return Ok(lotes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Lote>> GetById(Guid id)
        {
            var lote = await _service.GetByIdAsync(id);
            if (lote == null)
            {
                return NotFound();
            }
            return Ok(lote);
        }

        [HttpPost]
        public async Task<ActionResult<Lote>> PostLote([FromBody] LoteCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var lote = new Lote
            {
                CodigoLote = dto.CodigoLote,
                Descricao = dto.Descricao,
                Observacoes = dto.Observacoes,
                ProdutoId = dto.ProdutoId,
                AlmoxarifadoId = dto.AlmoxarifadoId
            };

            var newLote = await _service.CreateAsync(lote);
            return CreatedAtAction(nameof(GetById), new { id = newLote.Id }, newLote);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutLote(Guid id, Lote lote)
        {
            if (id != lote.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(lote);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLote(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}