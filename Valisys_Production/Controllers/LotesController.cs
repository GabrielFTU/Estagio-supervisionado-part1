using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
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

            try
            {
                
                var newLote = await _service.CreateFromDtoAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = newLote.Id }, newLote);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutLote(Guid id, Lote lote)
        {
            if (!id.Equals(lote.Id))
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