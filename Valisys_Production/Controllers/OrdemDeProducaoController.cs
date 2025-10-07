using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Valisys_Production.DTOs;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdensDeProducaoController : ControllerBase
    {
        private readonly IOrdemDeProducaoService _service;
        private readonly IMapper _mapper;

        public OrdensDeProducaoController(IOrdemDeProducaoService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        //Busca todas as O.P.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrdemDeProducao>>> GetAll()
        {
            var ordensDeProducao = await _service.GetAllAsync();
            return Ok(ordensDeProducao);
        }

        //Busca O.P. Por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<OrdemDeProducao>> GetById(int id)
        {
            var ordemDeProducao = await _service.GetByIdAsync(id);
            if (ordemDeProducao == null)
            {
                return NotFound();
            }
            return Ok(ordemDeProducao);
        }
        //Criação da O.P. e movimentação inicial
        [HttpPost]
        public async Task<ActionResult<OrdemDeProducao>> PostOrdemDeProducao([FromBody] OrdemDeProducaoCreateDto ordemDto)
        {
            try
            {
                var ordemDeProducao = _mapper.Map<OrdemDeProducao>(ordemDto);
                var newOrdemDeProducao = await _service.CreateAsync(ordemDeProducao);

                return CreatedAtAction(nameof(GetById), new { id = newOrdemDeProducao.Id }, newOrdemDeProducao);
            }
            catch (ArgumentException ex) 
            {
                return BadRequest(new {message = ex.Message});
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrdemDeProducao(int id, OrdemDeProducao ordemDeProducao)
        {
            if (id != ordemDeProducao.Id)
            {
                return BadRequest();
            }
            await _service.UpdateAsync(ordemDeProducao);
            return NoContent();
        }
        //Deleta a O.P. filtrando por ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrdemDeProducao(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}