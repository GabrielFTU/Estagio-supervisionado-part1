using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FasesProducaoController : ControllerBase
    {
        private readonly IFaseProducaoService _service;

        public FasesProducaoController(IFaseProducaoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FaseProducao>>> GetAll()
        {
            var fasesProducao = await _service.GetAllAsync();
            return Ok(fasesProducao);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FaseProducao>> GetById(int id)
        {
            var faseProducao = await _service.GetByIdAsync(id);
            if (faseProducao == null)
            {
                return NotFound();
            }
            return Ok(faseProducao);
        }

        [HttpPost]
        public async Task<ActionResult<FaseProducao>> PostFaseProducao(FaseProducao faseProducao)
        {
            var newFaseProducao = await _service.CreateAsync(faseProducao);
            return CreatedAtAction(nameof(GetById), new { id = newFaseProducao.Id }, newFaseProducao);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFaseProducao(int id, FaseProducao faseProducao)
        {
            if (id != faseProducao.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(faseProducao);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFaseProducao(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}