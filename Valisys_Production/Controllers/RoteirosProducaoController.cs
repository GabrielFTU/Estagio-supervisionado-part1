using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Valisys_Production.DTOs;
using Valisys_Production.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoteirosProducaoController : ControllerBase
    {
        private readonly IRoteiroProducaoService _service;
        private readonly IMapper _mapper;

        public RoteirosProducaoController(IRoteiroProducaoService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<RoteiroProducaoReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<RoteiroProducaoReadDto>>> GetAll()
        {
            var roteiros = await _service.GetAllAsync();
            var roteirosDto = _mapper.Map<IEnumerable<RoteiroProducaoReadDto>>(roteiros);
            return Ok(roteirosDto);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(RoteiroProducaoReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<RoteiroProducaoReadDto>> GetById(Guid id)
        {
            var roteiro = await _service.GetByIdAsync(id);
            if (roteiro == null)
            {
                return NotFound();
            }
            var roteiroDto = _mapper.Map<RoteiroProducaoReadDto>(roteiro);
            return Ok(roteiroDto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(RoteiroProducaoReadDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<RoteiroProducaoReadDto>> Create(RoteiroProducaoCreateDto dto)
        {
            try
            {
                var novoRoteiro = await _service.CreateAsync(dto);
                var readDto = _mapper.Map<RoteiroProducaoReadDto>(novoRoteiro);
                return CreatedAtAction(nameof(GetById), new { id = readDto.Id }, readDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
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
        public async Task<IActionResult> Update(Guid id, RoteiroProducaoUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest(new { message = "ID da URL diverge do ID do corpo da requisição." });

            try
            {
                var sucesso = await _service.UpdateAsync(dto);
                if (!sucesso) return NotFound();
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var sucesso = await _service.DeleteAsync(id);
            if (!sucesso) return NotFound();
            return NoContent();
        }
    }
}