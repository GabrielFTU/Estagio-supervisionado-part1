using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdensDeProducaoController : ControllerBase
    {
        private readonly IOrdemDeProducaoService _service;

        public OrdensDeProducaoController(IOrdemDeProducaoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrdemDeProducao>>> GetAll()
        {
            var ordensDeProducao = await _service.GetAllAsync();
            return Ok(ordensDeProducao);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrdemDeProducao>> GetById(int id)
        {
            var ordemDeProducao = await _service.GetByIdAsync(id);
            if (ordemDeProducao == null)
            {
                return NotFound();
            }
            return Ok(ordemDeProducao);
        }

        [HttpPost]
        public async Task<ActionResult<OrdemDeProducao>> PostOrdemDeProducao(OrdemDeProducao ordemDeProducao)
        {
            var newOrdemDeProducao = await _service.CreateAsync(ordemDeProducao);
            return CreatedAtAction(nameof(GetById), new { id = newOrdemDeProducao.Id }, newOrdemDeProducao);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrdemDeProducao(int id, OrdemDeProducao ordemDeProducao)
        {
            if (id != ordemDeProducao.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(ordemDeProducao);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrdemDeProducao(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}