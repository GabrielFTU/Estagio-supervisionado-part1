using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PerfisController : ControllerBase
    {
        private readonly IPerfilService _service;

        public PerfisController(IPerfilService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Perfil>>> GetAll()
        {
            var perfis = await _service.GetAllAsync();
            return Ok(perfis);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Perfil>> GetById(int id)
        {
            var perfil = await _service.GetByIdAsync(id);
            if (perfil == null)
            {
                return NotFound();
            }
            return Ok(perfil);
        }

        [HttpPost]
        public async Task<ActionResult<Perfil>> PostPerfil(Perfil perfil)
        {
            var newPerfil = await _service.CreateAsync(perfil);
            return CreatedAtAction(nameof(GetById), new { id = newPerfil.Id }, newPerfil);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerfil(int id, Perfil perfil)
        {
            if (id != perfil.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(perfil);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerfil(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}