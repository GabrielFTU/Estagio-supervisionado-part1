using Microsoft.AspNetCore.Mvc;
using Valisys_Production.DTOs;
using Valisys_Production.Services.Interfaces;
using AutoMapper; 
using Valisys_Production.Models;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public AuthController(IAuthService authService, IMapper mapper) 
        {
            _authService = authService;
            _mapper = mapper;
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var (token, usuario) = await _authService.LoginAsync(loginDto);

                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new { message = "Credenciais inválidas." });
                }

                var userDto = _mapper.Map<UsuarioReadDto>(usuario);

                return Ok(new { token, user = userDto }); 
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Credenciais inválidas." });
            }
        }
    }
}