using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _service;

        public UsuariosController(IUsuarioService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetAll()
        {
            var usuarios = await _service.GetAllAsync();
    
            var safeUsuarios = usuarios.Select(u => new Usuario
            {
                Id = u.Id,
                Nome = u.Nome,
                Email = u.Email,
                Ativo = u.Ativo,
                PerfilId = u.PerfilId,
                Perfil = u.Perfil 
            });
            return Ok(safeUsuarios);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetById(int id)
        {
            var usuario = await _service.GetByIdAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            // Retornar dados seguros
            var safeUsuario = new Usuario
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Ativo = usuario.Ativo,
                PerfilId = usuario.PerfilId,
                Perfil = usuario.Perfil
            };
            return Ok(safeUsuario);
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            var newUsuario = await _service.CreateAsync(usuario);
            var safeUsuario = new Usuario
            {
                Id = newUsuario.Id,
                Nome = newUsuario.Nome,
                Email = newUsuario.Email,
                Ativo = newUsuario.Ativo,
                PerfilId = newUsuario.PerfilId,
                Perfil = newUsuario.Perfil
            };
            return CreatedAtAction(nameof(GetById), new { id = safeUsuario.Id }, safeUsuario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(Guid id, Usuario usuario)
        {
            if (id != usuario.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(usuario);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}