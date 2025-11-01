using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LotesController : ControllerBase
    {
        private readonly ILoteService _service;
        private readonly IMapper _mapper;

        public LotesController(ILoteService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<LoteReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<LoteReadDto>>> GetAll()
        {
            var lotes = await _service.GetAllAsync();
            var loteDtos = _mapper.Map<IEnumerable<LoteReadDto>>(lotes);
            return Ok(loteDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(LoteReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<LoteReadDto>> GetById(Guid id)
        {
            var lote = await _service.GetByIdAsync(id);
            if (lote == null)
            {
                return NotFound();
            }
            var loteDto = _mapper.Map<LoteReadDto>(lote);
            return Ok(loteDto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(LoteReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<LoteReadDto>> PostLote([FromBody] LoteCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {

                var newLote = await _service.CreateAsync(dto);
                var newLoteDto = _mapper.Map<LoteReadDto>(newLote);

                return CreatedAtAction(nameof(GetById), new { id = newLoteDto.Id }, newLoteDto);
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
        public async Task<IActionResult> PutLote(Guid id, LoteUpdateDto loteDto)
        {
            if (!id.Equals(loteDto.Id))
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID do lote no corpo da requisição." });
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var lote = _mapper.Map<Lote>(loteDto);
                var updated = await _service.UpdateAsync(lote);

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
        public async Task<IActionResult> DeleteLote(Guid id)
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