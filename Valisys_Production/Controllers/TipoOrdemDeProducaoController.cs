using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiposDeOrdemDeProducaoController : ControllerBase
    {
        private readonly ITipoOrdemDeProducaoService _service;
        private readonly IMapper _mapper;

        public TiposDeOrdemDeProducaoController(ITipoOrdemDeProducaoService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TipoOrdemDeProducaoReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<TipoOrdemDeProducaoReadDto>>> GetAll()
        {
            var tipos = await _service.GetAllAsync();
            var tipoDtos = _mapper.Map<IEnumerable<TipoOrdemDeProducaoReadDto>>(tipos);
            return Ok(tipoDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(TipoOrdemDeProducaoReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<TipoOrdemDeProducaoReadDto>> GetById(Guid id)
        {
            var tipo = await _service.GetByIdAsync(id);
            if (tipo == null)
            {
                return NotFound();
            }
            var tipoDto = _mapper.Map<TipoOrdemDeProducaoReadDto>(tipo);
            return Ok(tipoDto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(TipoOrdemDeProducaoReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<TipoOrdemDeProducaoReadDto>> PostTipoOrdemDeProducao(TipoOrdemDeProducaoCreateDto tipoOrdemDeProducaoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var tipoOrdemDeProducao = _mapper.Map<TipoOrdemDeProducao>(tipoOrdemDeProducaoDto);
                var newTipo = await _service.CreateAsync(tipoOrdemDeProducao);
                var newTipoDto = _mapper.Map<TipoOrdemDeProducaoReadDto>(newTipo);

                return CreatedAtAction(nameof(GetById), new { id = newTipoDto.Id }, newTipoDto);
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
        public async Task<IActionResult> PutTipoOrdemDeProducao(Guid id, TipoOrdemDeProducaoUpdateDto tipoOrdemDeProducaoDto)
        {
            if (id != tipoOrdemDeProducaoDto.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID do tipo de ordem no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var tipoOrdemDeProducao = _mapper.Map<TipoOrdemDeProducao>(tipoOrdemDeProducaoDto);
                var updated = await _service.UpdateAsync(tipoOrdemDeProducao);

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
        public async Task<IActionResult> DeleteTipoOrdemDeProducao(Guid id)
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