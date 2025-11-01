using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;


namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FasesProducaoController : ControllerBase
    {
        private readonly IFaseProducaoService _service;
        private readonly IMapper _mapper;

        public FasesProducaoController(IFaseProducaoService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<FaseProducaoReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<FaseProducaoReadDto>>> GetAll()
        {
            var fasesProducao = await _service.GetAllAsync();
            var faseDtos = _mapper.Map<IEnumerable<FaseProducaoReadDto>>(fasesProducao);
            return Ok(faseDtos);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(FaseProducaoReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<FaseProducaoReadDto>> GetById(Guid id)
        {
            var faseProducao = await _service.GetByIdAsync(id);
            if (faseProducao == null)
            {
                return NotFound();
            }
            var faseDto = _mapper.Map<FaseProducaoReadDto>(faseProducao);
            return Ok(faseDto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(FaseProducaoReadDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<FaseProducaoReadDto>> PostFaseProducao(FaseProducaoCreateDto faseProducaoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var faseProducao = _mapper.Map<FaseProducao>(faseProducaoDto);
                var newFaseProducao = await _service.CreateAsync(faseProducao);
                var newFaseDto = _mapper.Map<FaseProducaoReadDto>(newFaseProducao);

                return CreatedAtAction(nameof(GetById), new { id = newFaseDto.Id }, newFaseDto);
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
        public async Task<IActionResult> PutFaseProducao(Guid id, FaseProducaoUpdateDto faseProducaoDto)
        {
            if (id != faseProducaoDto.Id)
            {
                return BadRequest(new { message = "O ID da rota não corresponde ao ID da fase de produção no corpo da requisição." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var faseProducao = _mapper.Map<FaseProducao>(faseProducaoDto);
                var updated = await _service.UpdateAsync(faseProducao);

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
        public async Task<IActionResult> DeleteFaseProducao(Guid id)
        {
            try
            {
                var delete = await _service.DeleteAsync(id);

                if (!delete)
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