using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FichasTecnicasController : ControllerBase
    {
        private readonly IFichaTecnicaService _service;
        private readonly IMapper _mapper;

        public FichasTecnicasController(IFichaTecnicaService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;

        }
       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FichaTecnicaReadDto>>> GetAll()
        {
            var fichas = await _service.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<FichaTecnicaReadDto>>(fichas));
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<FichaTecnicaReadDto>> GetById(Guid id)
        {
            var ficha = await _service.GetByIdAsync(id);
            if (ficha == null) return NotFound();
            return Ok(_mapper.Map<FichaTecnicaReadDto>(ficha));
        }

        [HttpGet("proximo-codigo")]
        public async Task<ActionResult<object>> GetProximoCodigo()
        {
            var codigo = await _service.ObterProximoCodigoAsync();
            return Ok(new { codigo });
        }


        [HttpPost]
        public async Task<ActionResult<FichaTecnicaReadDto>> Create(FichaTecnicaCreateDto dto)
        {
            try
            {
                var ficha = new FichaTecnica
                {
                    ProdutoId = dto.ProdutoId,
                    CodigoFicha = dto.Codigo,
                    Versao = dto.Versao,
                    Descricao = dto.Descricao,
                    Itens = dto.Itens.Select(i => new FichaTecnicaItem
                    {
                        ProdutoComponenteId = i.ProdutoComponenteId,
                        Quantidade = i.Quantidade,
                        PerdaPercentual = i.PerdaPercentual
                    }).ToList()
                };

                var novaFicha = await _service.CreateAsync(ficha);
                var readDto = _mapper.Map<FichaTecnicaReadDto>(novaFicha);

                return CreatedAtAction(nameof(GetById), new { id = readDto.Id }, readDto);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, FichaTecnicaUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest(new { message = "ID da URL diverge do ID do corpo." });

            try
            {
                var sucesso = await _service.UpdateAsync(dto);
                if (!sucesso) return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}