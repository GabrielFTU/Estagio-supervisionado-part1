using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System; 

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasProdutoController : ControllerBase
    {
        private readonly ICategoriaProdutoService _service;

        public CategoriasProdutoController(ICategoriaProdutoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaProduto>>> GetAll()
        {
            var categorias = await _service.GetAllAsync();
            return Ok(categorias);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaProduto>> GetById(Guid id)
        {
            var categoria = await _service.GetByIdAsync(id);
            if (categoria == null)
            {
                return NotFound();
            }
            return Ok(categoria);
        }

        [HttpPost]
        public async Task<ActionResult<CategoriaProduto>> PostCategoriaProduto(CategoriaProduto categoriaProduto)
        {
            var newCategoria = await _service.CreateAsync(categoriaProduto);
           
            return CreatedAtAction(nameof(GetById), new { id = newCategoria.Id }, newCategoria);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoriaProduto(Guid id, CategoriaProduto categoriaProduto)
        {
            if (!id.Equals(categoriaProduto.Id))
            {
                return BadRequest();
            }
            await _service.UpdateAsync(categoriaProduto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoriaProduto(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}