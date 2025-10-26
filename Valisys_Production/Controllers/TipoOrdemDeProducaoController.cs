using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiposDeOrdemDeProducaoController : ControllerBase
    {
        private readonly ITipoOrdemDeProducaoService _service;

        public TiposDeOrdemDeProducaoController(ITipoOrdemDeProducaoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoOrdemDeProducao>>> GetAll()
        {
            var tipos = await _service.GetAllAsync();
            return Ok(tipos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TipoOrdemDeProducao>> GetById(Guid id)
        {
            var tipo = await _service.GetByIdAsync(id);
            if (tipo == null)
            {
                return NotFound();
            }
            return Ok(tipo);
        }

        [HttpPost]
        public async Task<ActionResult<TipoOrdemDeProducao>> PostTipoOrdemDeProducao(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            var newTipo = await _service.CreateAsync(tipoOrdemDeProducao);
            return CreatedAtAction(nameof(GetById), new { id = newTipo.Id }, newTipo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoOrdemDeProducao(Guid id, TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            if (id != tipoOrdemDeProducao.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(tipoOrdemDeProducao);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoOrdemDeProducao(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}