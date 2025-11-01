using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PerfisController : ControllerBase
    {
        private readonly IPerfilService _service;
        private readonly IMapper _mapper;

        public PerfisController(IPerfilService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PerfilReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<PerfilReadDto>>> GetAll()
        {
            var perfis = await _service.GetAllAsync();
            var perfilDtos = _mapper.Map<IEnumerable<PerfilReadDto>>(perfis);
            return Ok(perfilDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(PerfilReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<PerfilReadDto>> GetById(Guid id)
        {
            var perfil = await _service.GetByIdAsync(id);
            if (perfil == null)
            {
                return NotFound();
            }
            var perfilDto = _mapper.Map<PerfilReadDto>(perfil);
            return Ok(perfilDto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(PerfilReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<PerfilReadDto>> PostPerfil(PerfilCreateDto perfilDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var perfil = _mapper.Map<Perfil>(perfilDto);
                var newPerfil = await _service.CreateAsync(perfil);
                var newPerfilDto = _mapper.Map<PerfilReadDto>(newPerfil);

                return CreatedAtAction(nameof(GetById), new { id = newPerfilDto.Id }, newPerfilDto);
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
        public async Task<IActionResult> PutPerfil(Guid id, PerfilUpdateDto perfilDto)
        {
            if (id != perfilDto.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID do perfil no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var perfil = _mapper.Map<Perfil>(perfilDto);
                var updated = await _service.UpdateAsync(perfil);

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
        public async Task<IActionResult> DeletePerfil(Guid id)
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