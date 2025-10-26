using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;   
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly IProdutoService _service;
        private readonly IMapper _mapper;   

        public ProdutosController(IProdutoService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetAll()
        {
            var produtos = await _service.GetAllAsync();
            return Ok(produtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetById(int id)
        {
            var produto = await _service.GetByIdAsync(id);
            if (produto == null)
            {
                return NotFound();
            }return Ok(produto);
        }
        [HttpPost]
        public async Task<ActionResult<Produto>> PostProduto([FromBody] ProdutoCreateDto produtoDto)
        {
            var produto = _mapper.Map<Produto>(produtoDto);
            var newProduto = await _service.CreateAsync(produto);
            return CreatedAtAction(nameof(GetById), new { id = newProduto.Id }, newProduto);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduto (Guid id, Produto produto)
        {
            if (id != produto.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(produto);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduto(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

    }
}
