using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlmoxarifadoController : ControllerBase
    {
        private readonly IAlmoxarifadoService _service;
        private readonly IMapper _mapper;

        public AlmoxarifadoController(IAlmoxarifadoService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AlmoxarifadoReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<AlmoxarifadoReadDto>>> GetAll()
        {
            var almoxarifados = await _service.GetAllAsync();
            var almoxarifadoDtos = _mapper.Map<IEnumerable<AlmoxarifadoReadDto>>(almoxarifados);
            return Ok(almoxarifadoDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(AlmoxarifadoReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<AlmoxarifadoReadDto>> GetById(Guid id)
        {
            var almoxarifado = await _service.GetByIdAsync(id);
            if (almoxarifado == null)
            {
                return NotFound();
            }
            var almoxarifadoDto = _mapper.Map<AlmoxarifadoReadDto>(almoxarifado);
            return Ok(almoxarifadoDto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(AlmoxarifadoReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<AlmoxarifadoReadDto>> PostAlmoxarifado(AlmoxarifadoCreateDto almoxarifadoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var almoxarifado = _mapper.Map<Almoxarifado>(almoxarifadoDto);
                var newAlmoxarifado = await _service.CreateAsync(almoxarifado);
                var newAlmoxarifadoDto = _mapper.Map<AlmoxarifadoReadDto>(newAlmoxarifado);

                return CreatedAtAction(nameof(GetById), new { id = newAlmoxarifadoDto.Id }, newAlmoxarifadoDto);
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
        public async Task<IActionResult> PutAlmoxarifado(Guid id, AlmoxarifadoUpdateDto almoxarifadoDto)
        {
            if (id != almoxarifadoDto.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID do almoxarifado no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var almoxarifado = _mapper.Map<Almoxarifado>(almoxarifadoDto);
                var updated = await _service.UpdateAsync(almoxarifado);

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
        public async Task<IActionResult> DeleteAlmoxarifado(Guid id)
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