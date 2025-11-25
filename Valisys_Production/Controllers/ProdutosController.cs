using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
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
        [ProducesResponseType(typeof(IEnumerable<ProdutoReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<ProdutoReadDto>>> GetAll([FromQuery] bool apenasAtivos = false)
        {
            var produtos = await _service.GetAllAsync();
     
            if (apenasAtivos)
            {
                produtos = produtos.Where(p => p.Ativo);
            }

            var produtoDtos = _mapper.Map<IEnumerable<ProdutoReadDto>>(produtos);
            return Ok(produtoDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(ProdutoReadDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<ProdutoReadDto>> GetById(Guid id)
        {
            try
            {
                var produto = await _service.GetByIdAsync(id);
                if (produto == null)
                {
                    return NotFound();
                }
                var produtoDto = _mapper.Map<ProdutoReadDto>(produto);
                return Ok(produtoDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ProdutoReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<ProdutoReadDto>> PostProduto([FromBody] ProdutoCreateDto produtoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var produto = _mapper.Map<Produto>(produtoDto);
                var newProduto = await _service.CreateAsync(produto);
                var newProdutoDto = _mapper.Map<ProdutoReadDto>(newProduto);

                return CreatedAtAction(nameof(GetById), new { id = newProdutoDto.Id }, newProdutoDto);
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
        public async Task<IActionResult> PutProduto(Guid id, ProdutoUpdateDto produtoDto)
        {
            if (id != produtoDto.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID do produto no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var produto = _mapper.Map<Produto>(produtoDto);
                var updated = await _service.UpdateAsync(produto);

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
        public async Task<IActionResult> DeleteProduto(Guid id)
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