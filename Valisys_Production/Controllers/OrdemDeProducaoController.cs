using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs; 

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdensDeProducaoController : ControllerBase
    {
        private readonly IOrdemDeProducaoService _service;
        private readonly IMapper _mapper;

        public OrdensDeProducaoController(IOrdemDeProducaoService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        private Guid GetAuthenticatedUserId()
        { 
            return Guid.Parse("A1B2C3D4-E5F6-7890-ABCD-EF0011223344");
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<OrdemDeProducao>), 200)]
        public async Task<ActionResult<IEnumerable<OrdemDeProducao>>> GetAll()
        {
            var ordensDeProducao = await _service.GetAllAsync();
            return Ok(ordensDeProducao);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(OrdemDeProducao), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<OrdemDeProducao>> GetById(Guid id)
        {
            try
            {
                var ordemDeProducao = await _service.GetByIdAsync(id);
                if (ordemDeProducao == null)
                {
                    return NotFound();
                }
                return Ok(ordemDeProducao);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(OrdemDeProducao), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<OrdemDeProducao>> PostOrdemDeProducao([FromBody] OrdemDeProducaoCreateDto ordemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var ordemDeProducao = _mapper.Map<OrdemDeProducao>(ordemDto);
                var usuarioId = GetAuthenticatedUserId();

                var newOrdemDeProducao = await _service.CreateAsync(ordemDeProducao, usuarioId);

                return CreatedAtAction(nameof(GetById), new { id = newOrdemDeProducao.Id }, newOrdemDeProducao);
            }
            catch (ArgumentException ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException) 
            {
                return NotFound(new { message = "Produto referenciado não encontrado." });
            }
            catch (InvalidOperationException ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutOrdemDeProducao(Guid id, [FromBody] OrdemDeProducao ordemDeProducao)
        {
            if (id != ordemDeProducao.Id)
            {
                return BadRequest(new { message = "O ID da rota deve ser igual ao ID no corpo da requisição." });
            }

            try
            {
                var updated = await _service.UpdateAsync(ordemDeProducao);
                if (!updated)
                {
                    return StatusCode(500, new { message = "Falha ao atualizar a Ordem de Produção." });
                }
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> DeleteOrdemDeProducao(Guid id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex) 
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }
}