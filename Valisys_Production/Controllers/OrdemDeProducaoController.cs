using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;
using System.Security.Claims;

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
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("Usuário não autenticado ou Claim ID ausente.");
            }

            return userId;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<OrdemDeProducaoReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<OrdemDeProducaoReadDto>>> GetAll()
        {
            var ordensDeProducao = await _service.GetAllAsync();
            var ordemDtos = _mapper.Map<IEnumerable<OrdemDeProducaoReadDto>>(ordensDeProducao);
            return Ok(ordemDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(OrdemDeProducaoReadDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<OrdemDeProducaoReadDto>> GetById(Guid id)
        {
            try
            {
                var ordemDeProducao = await _service.GetByIdAsync(id);
                if (ordemDeProducao == null)
                {
                    return NotFound();
                }
                var ordemDto = _mapper.Map<OrdemDeProducaoReadDto>(ordemDeProducao);
                return Ok(ordemDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(OrdemDeProducaoReadDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<OrdemDeProducaoReadDto>> PostOrdemDeProducao([FromBody] OrdemDeProducaoCreateDto ordemDto)
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
                var newOrdemDto = _mapper.Map<OrdemDeProducaoReadDto>(newOrdemDeProducao);

                return CreatedAtAction(nameof(GetById), new { id = newOrdemDto.Id }, newOrdemDto);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Recurso dependente (Produto, Lote, etc.) não encontrado." });
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
        public async Task<IActionResult> PutOrdemDeProducao(Guid id, [FromBody] OrdemDeProducaoUpdateDto ordemDto)
        {
            if (id != ordemDto.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var ordemDeProducao = _mapper.Map<OrdemDeProducao>(ordemDto);
                var updated = await _service.UpdateAsync(ordemDeProducao);

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
                var deleted = await _service.DeleteAsync(id);
                if (!deleted)
                {
                    return NotFound();
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
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }
}