using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _service;
        private readonly IMapper _mapper;

        public UsuariosController(IUsuarioService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UsuarioReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<UsuarioReadDto>>> GetAll()
        {
            var usuarios = await _service.GetAllAsync();
            var safeUsuarios = _mapper.Map<List<UsuarioReadDto>>(usuarios);
            return Ok(safeUsuarios);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(UsuarioReadDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<UsuarioReadDto>> GetById(Guid id)
        {
            try
            {
                var usuario = await _service.GetByIdAsync(id);
                if (usuario == null)
                {
                    return NotFound();
                }
                var safeUsuario = _mapper.Map<UsuarioReadDto>(usuario);
                return Ok(safeUsuario);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(UsuarioReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<UsuarioReadDto>> PostUsuario(UsuarioCreateDto usuarioDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newUsuario = await _service.CreateAsync(usuarioDto);

                var safeUsuario = _mapper.Map<UsuarioReadDto>(newUsuario);

                return CreatedAtAction(nameof(GetById), new { id = safeUsuario.Id }, safeUsuario);
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
        public async Task<IActionResult> PutUsuario(Guid id, UsuarioUpdateDto usuarioDto)
        {
            if (id != usuarioDto.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID do usuário no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
         
                var usuario = _mapper.Map<Usuario>(usuarioDto);
                var updated = await _service.UpdateAsync(usuario);

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
        public async Task<IActionResult> DeleteUsuario(Guid id)
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