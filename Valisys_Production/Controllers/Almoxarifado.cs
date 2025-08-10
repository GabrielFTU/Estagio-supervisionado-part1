using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces; 

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlmoxarifadoController : ControllerBase
    {
        private readonly IAlmoxarifadoService _service; 

        public AlmoxarifadoController(IAlmoxarifadoService service)
        {
            _service = service; 
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Almoxarifado>>> GetAll()
        {
            var almoxarifados = await _service.GetAllAsync();
            return Ok(almoxarifados);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Almoxarifado>> GetById(int id)
        {
            var almoxarifado = await _service.GetByIdAsync(id);
            if (almoxarifado == null)
            {
                return NotFound();
            }
            return Ok(almoxarifado);
        }

        [HttpPost]
        public async Task<ActionResult<Almoxarifado>> PostAlmoxarifado(Almoxarifado almoxarifado)
        {
            var newAlmoxarifado = await _service.CreateAsync(almoxarifado);
            return CreatedAtAction(nameof(GetById), new { id = newAlmoxarifado.Id }, newAlmoxarifado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAlmoxarifado(int id, Almoxarifado almoxarifado)
        {
            if (id != almoxarifado.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(almoxarifado);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlmoxarifado(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}