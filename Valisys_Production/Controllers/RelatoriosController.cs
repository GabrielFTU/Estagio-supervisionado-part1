using Microsoft.AspNetCore.Mvc;
using Valisys_Production.Services;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly IPdfReportService _pdfService;
        private readonly IOrdemDeProducaoService _ordemService;
        private readonly IMovimentacaoService _movimentacaoService;
        private readonly IProdutoService _produtoService;

        public RelatoriosController(
            IPdfReportService pdfService,
            IOrdemDeProducaoService ordemService,
            IMovimentacaoService movimentacaoService,
            IProdutoService produtoService)
        {
            _pdfService = pdfService;
            _ordemService = ordemService;
            _movimentacaoService = movimentacaoService;
            _produtoService = produtoService;
        }

        [HttpGet("ordem-producao/{id:guid}")]
        [ProducesResponseType(typeof(FileContentResult), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GerarRelatorioOrdemProducao(Guid id)
        {
            try
            {
                var ordem = await _ordemService.GetByIdAsync(id);

                if (ordem == null)
                {
                    return NotFound(new { message = "Ordem de produção não encontrada." });
                }

                var pdfBytes = _pdfService.GerarRelatorioOrdemProducao(ordem);

                return File(
                    pdfBytes,
                    "application/pdf",
                    $"OrdemProducao_{ordem.CodigoOrdem}_{DateTime.Now:yyyyMMdd}.pdf"
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao gerar relatório.", details = ex.Message });
            }
        }

        [HttpGet("movimentacoes")]
        [ProducesResponseType(typeof(FileContentResult), 200)]
        public async Task<IActionResult> GerarRelatorioMovimentacoes(
            [FromQuery] DateTime? dataInicio,
            [FromQuery] DateTime? dataFim)
        {
            try
            {
                var movimentacoes = await _movimentacaoService.GetAllAsync();

                if (dataInicio.HasValue)
                {
                    movimentacoes = movimentacoes.Where(m => m.DataMovimentacao >= dataInicio.Value);
                }
                if (dataFim.HasValue)
                {
                    movimentacoes = movimentacoes.Where(m => m.DataMovimentacao <= dataFim.Value);
                }

                var pdfBytes = _pdfService.GerarRelatorioMovimentacoes(movimentacoes);

                return File(
                    pdfBytes,
                    "application/pdf",
                    $"Movimentacoes_{DateTime.Now:yyyyMMdd_HHmmss}.pdf"
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao gerar relatório.", details = ex.Message });
            }
        }

        [HttpGet("produtos")]
        [ProducesResponseType(typeof(FileContentResult), 200)]
        public async Task<IActionResult> GerarRelatorioProdutos(
            [FromQuery] bool? apenasAtivos = null)
        {
            try
            {
                var produtos = await _produtoService.GetAllAsync();

                if (apenasAtivos == true)
                {
                    produtos = produtos.Where(p => p.Ativo);
                }

                var pdfBytes = _pdfService.GerarRelatorioProdutos(produtos);

                return File(
                    pdfBytes,
                    "application/pdf",
                    $"CatalogoProdutos_{DateTime.Now:yyyyMMdd}.pdf"
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao gerar relatório.", details = ex.Message });
            }
        }

        [HttpGet("ordem-producao/{id:guid}/visualizar")]
        [ProducesResponseType(typeof(FileContentResult), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> VisualizarRelatorioOrdemProducao(Guid id)
        {
            try
            {
                var ordem = await _ordemService.GetByIdAsync(id);

                if (ordem == null)
                {
                    return NotFound(new { message = "Ordem de produção não encontrada." });
                }

                var pdfBytes = _pdfService.GerarRelatorioOrdemProducao(ordem);

                Response.Headers.Add("Content-Disposition", "inline");
                return File(pdfBytes, "application/pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao gerar relatório.", details = ex.Message });
            }
        }
    }
}