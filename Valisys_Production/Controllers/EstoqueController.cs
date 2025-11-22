using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.DTOs;
using Valisys_Production.Models;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstoqueController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EstoqueController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("simples")]
        public async Task<ActionResult<IEnumerable<EstoqueSimplesDto>>> GetEstoqueSimples()
        {
            var lotesConcluidos = await _context.Lotes
                .AsNoTracking()
                .Include(l => l.Produto)
                .ThenInclude(p => p.UnidadeMedida)
                .Where(l => l.statusLote == StatusLote.Concluido)
                .ToListAsync();

            var estoque = lotesConcluidos
                .GroupBy(l => l.ProdutoId)
                .Select(g => new EstoqueSimplesDto
                {
                    ProdutoId = g.Key,
                    ProdutoNome = g.First().Produto.Nome,
                    CodigoProduto = g.First().Produto.CodigoInternoProduto,
                    UnidadeMedida = g.First().Produto.UnidadeMedida.Sigla,
                    QuantidadeTotal = g.Count() 
                })
                .ToList();

            return Ok(estoque);
        }
        [HttpGet("analitico")]
        public async Task<ActionResult<IEnumerable<EstoqueAnaliticoDto>>> GetEstoqueAnalitico()
        {
            var estoque = await _context.Lotes
                .AsNoTracking()
                .Include(l => l.Produto)
                .Include(l => l.Almoxarifado)
                .Where(l => l.statusLote == StatusLote.Concluido)
                .Select(l => new EstoqueAnaliticoDto
                {
                    LoteId = l.Id,
                    Chassi = l.CodigoLote,
                    ProdutoId = l.ProdutoId,
                    ProdutoNome = l.Produto.Nome,
                    Localizacao = l.Almoxarifado.Nome,
                    DataConclusao = l.DataConclusao ?? l.DataAbertura,
                    Status = "Disponível"
                })
                .ToListAsync();

            return Ok(estoque);
        }
    }
}