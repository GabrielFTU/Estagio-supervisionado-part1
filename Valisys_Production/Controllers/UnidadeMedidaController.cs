using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public async Task<ActionResult<IEnumerable<UnidadeMedida>>> GetAll()
        {
            var unidadesMedida = await _service.GetAllAsync();
            return Ok(unidadesMedida);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UnidadeMedida>> GetById(int id)
        {
            var unidadeMedida = await _service.GetByIdAsync(id);
            if (unidadeMedida == null)
            {
                return NotFound();
            }
            return Ok(unidadeMedida);
        }

        [HttpPost]
        public async Task<ActionResult<UnidadeMedida>> PostUnidadeMedida(UnidadeMedida unidadeMedida)
        {
            var newUnidadeMedida = await _service.CreateAsync(unidadeMedida);
            return CreatedAtAction(nameof(GetById), new { id = newUnidadeMedida.Id }, newUnidadeMedida);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUnidadeMedida(int id, UnidadeMedida unidadeMedida)
        {
            if (id != unidadeMedida.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(unidadeMedida);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnidadeMedida(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}