using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
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

        public MovimentacoesController(IMovimentacaoService service)
        {
            _service = service;
        }

        private Guid GetAuthenticatedUserId()
        {
            return Guid.Parse("A1B2C3D4-E5F6-7890-ABCD-EF0011223344");
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Movimentacao>), 200)]
        public async Task<ActionResult<IEnumerable<Movimentacao>>> GetAll()
        {
            var movimentacoes = await _service.GetAllAsync();
            return Ok(movimentacoes);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(Movimentacao), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<Movimentacao>> GetById(Guid id)
        {
            try
            {
                var movimentacao = await _service.GetByIdAsync(id);
                if (movimentacao == null)
                {
                    return NotFound();
                }
                return Ok(movimentacao);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(Movimentacao), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<Movimentacao>> Post([FromBody] MovimentacaoCreateDto movimentacaoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var usuarioId = GetAuthenticatedUserId();

                var newMovimentacao = await _service.CreateAsync(movimentacaoDto, usuarioId);

                return CreatedAtAction(nameof(GetById), new { id = newMovimentacao.Id }, newMovimentacao);
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
        public async Task<IActionResult> Put(Guid id, [FromBody] Movimentacao movimentacao)
        {
            if (id != movimentacao.Id)
            {
                return BadRequest(new { message = "O ID da rota deve ser igual ao ID no corpo da requisição." });
            }

            try
            {
                var updated = await _service.UpdateAsync(movimentacao);

                if (!updated)
                {
                    return StatusCode(500, new { message = "Falha ao atualizar a movimentação. Verifique a concorrência." });
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
        }
    }
}