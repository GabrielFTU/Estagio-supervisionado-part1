using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnidadesMedidaController : ControllerBase
    {
        private readonly IUnidadeMedidaService _service;

        public UnidadesMedidaController(IUnidadeMedidaService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UnidadeMedida>), 200)]
        public async Task<ActionResult<IEnumerable<UnidadeMedida>>> GetAll()
        {
            var unidadesMedida = await _service.GetAllAsync();
            return Ok(unidadesMedida);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(UnidadeMedida), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<UnidadeMedida>> GetById(Guid id)
        {
            var unidadeMedida = await _service.GetByIdAsync(id);
            if (unidadeMedida == null)
            {
                return NotFound();
            }
            return Ok(unidadeMedida);
        }

        [HttpPost]
        [ProducesResponseType(typeof(UnidadeMedida), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<UnidadeMedida>> PostUnidadeMedida(UnidadeMedida unidadeMedida)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newUnidadeMedida = await _service.CreateAsync(unidadeMedida);
                return CreatedAtAction(nameof(GetById), new { id = newUnidadeMedida.Id }, newUnidadeMedida);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutUnidadeMedida(Guid id, UnidadeMedida unidadeMedida)
        {
            if (id != unidadeMedida.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID da unidade de medida no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updated = await _service.UpdateAsync(unidadeMedida);

                if (!updated)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<IActionResult> DeleteUnidadeMedida(Guid id)
        {
            try
            {
                var deleted = await _service.DeleteAsync(id);

                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }
}