using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimentacoesController : ControllerBase
    {
        private readonly IMovimentacaoService _service;
        private readonly IMapper _mapper;

        public MovimentacoesController(IMovimentacaoService service, IMapper mapper)
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
        [ProducesResponseType(typeof(IEnumerable<MovimentacaoReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<MovimentacaoReadDto>>> GetAll()
        {
            var movimentacoes = await _service.GetAllAsync();
            var movimentacaoDtos = _mapper.Map<IEnumerable<MovimentacaoReadDto>>(movimentacoes);
            return Ok(movimentacaoDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(MovimentacaoReadDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<MovimentacaoReadDto>> GetById(Guid id)
        {
            try
            {
                var movimentacao = await _service.GetByIdAsync(id);
                if (movimentacao == null)
                {
                    return NotFound();
                }
                var movimentacaoDto = _mapper.Map<MovimentacaoReadDto>(movimentacao);
                return Ok(movimentacaoDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(MovimentacaoReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<MovimentacaoReadDto>> Post([FromBody] MovimentacaoCreateDto movimentacaoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var usuarioId = GetAuthenticatedUserId();
                var newMovimentacao = await _service.CreateAsync(movimentacaoDto, usuarioId);

                var newMovimentacaoDto = _mapper.Map<MovimentacaoReadDto>(newMovimentacao);

                return CreatedAtAction(nameof(GetById), new { id = newMovimentacaoDto.Id }, newMovimentacaoDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Put(Guid id, [FromBody] MovimentacaoUpdateDto movimentacaoDto)
        {
            if (id != movimentacaoDto.Id)
            {
                return BadRequest(new { message = "O ID da rota deve ser igual ao ID no corpo da requisição." });
            }

            try
            {
                var movimentacao = _mapper.Map<Movimentacao>(movimentacaoDto);
                var updated = await _service.UpdateAsync(movimentacao);

                if (!updated)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Delete(Guid id)
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
        }
    }
}