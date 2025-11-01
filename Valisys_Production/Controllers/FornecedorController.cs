using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FornecedoresController : ControllerBase
    {
        private readonly IFornecedorService _service;
        private readonly IMapper _mapper;

        public FornecedoresController(IFornecedorService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<FornecedorReadDto>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var fornecedores = await _service.GetAllAsync();
            var fornecedorDtos = _mapper.Map<IEnumerable<FornecedorReadDto>>(fornecedores);
            return Ok(fornecedorDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(FornecedorReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var fornecedor = await _service.GetByIdAsync(id);

            if (fornecedor == null)
            {
                return NotFound();
            }

            var fornecedorDto = _mapper.Map<FornecedorReadDto>(fornecedor);
            return Ok(fornecedorDto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(FornecedorReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<FornecedorReadDto>> PostFornecedor(FornecedorCreateDto fornecedorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var fornecedor = _mapper.Map<Fornecedor>(fornecedorDto);
                var newFornecedor = await _service.CreateAsync(fornecedor);
                var newFornecedorDto = _mapper.Map<FornecedorReadDto>(newFornecedor);

                return CreatedAtAction(nameof(GetById), new { id = newFornecedorDto.Id }, newFornecedorDto);
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
        public async Task<IActionResult> PutFornecedor(Guid id, FornecedorUpdateDto fornecedorDto)
        {
            if (id != fornecedorDto.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID do fornecedor no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var fornecedor = _mapper.Map<Fornecedor>(fornecedorDto);
                var updated = await _service.UpdateAsync(fornecedor);

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
        public async Task<IActionResult> DeleteFornecedor(Guid id)
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