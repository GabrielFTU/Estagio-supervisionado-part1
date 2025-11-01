using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SolicitacoesProducaoController : ControllerBase
    {
        private readonly ISolicitacaoProducaoService _service;
        private readonly IMapper _mapper;

        public SolicitacoesProducaoController(ISolicitacaoProducaoService service, IMapper mapper)
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
        [ProducesResponseType(typeof(IEnumerable<SolicitacaoProducaoReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<SolicitacaoProducaoReadDto>>> GetAll()
        {
            var solicitacoes = await _service.GetAllAsync();
            var solicitacaoDtos = _mapper.Map<IEnumerable<SolicitacaoProducaoReadDto>>(solicitacoes);
            return Ok(solicitacaoDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(SolicitacaoProducaoReadDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<SolicitacaoProducaoReadDto>> GetById(Guid id)
        {
            try
            {
                var solicitacao = await _service.GetByIdAsync(id);
                if (solicitacao == null)
                {
                    return NotFound();
                }
                var solicitacaoDto = _mapper.Map<SolicitacaoProducaoReadDto>(solicitacao);
                return Ok(solicitacaoDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(SolicitacaoProducaoReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<SolicitacaoProducaoReadDto>> PostSolicitacaoProducao(SolicitacaoProducaoCreateDto solicitacaoProducaoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var solicitacaoProducao = _mapper.Map<SolicitacaoProducao>(solicitacaoProducaoDto);
                var newSolicitacao = await _service.CreateAsync(solicitacaoProducao);
                var newSolicitacaoDto = _mapper.Map<SolicitacaoProducaoReadDto>(newSolicitacao);

                return CreatedAtAction(nameof(GetById), new { id = newSolicitacaoDto.Id }, newSolicitacaoDto);
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
        public async Task<IActionResult> PutSolicitacaoProducao(Guid id, SolicitacaoProducaoUpdateDto solicitacaoProducaoDto)
        {
            if (id != solicitacaoProducaoDto.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID da solicitação no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var solicitacaoProducao = _mapper.Map<SolicitacaoProducao>(solicitacaoProducaoDto);
                var updated = await _service.UpdateAsync(solicitacaoProducao);

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
        public async Task<IActionResult> DeleteSolicitacaoProducao(Guid id)
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

        [HttpPost("{solicitacaoId:guid}/aprovar")]
        [ProducesResponseType(typeof(List<OrdemDeProducaoReadDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<List<OrdemDeProducaoReadDto>>> AprovarSolicitacao(Guid solicitacaoId)
        {
            try
            {
                var usuarioAprovadorId = GetAuthenticatedUserId();

                var ordensGeradas = await _service.AprovarSolicitacaoAsync(solicitacaoId, usuarioAprovadorId);
                var ordemDtos = _mapper.Map<List<OrdemDeProducaoReadDto>>(ordensGeradas);

                return Ok(ordemDtos);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Solicitação ou recurso dependente não encontrado." });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
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
    }
}