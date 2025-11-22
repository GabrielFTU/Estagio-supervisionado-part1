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
        private readonly IAlmoxarifadoService _almoxarifadoService;
        private readonly ICategoriaProdutoService _categoriaService; // Injeção Nova

        public RelatoriosController(
            IPdfReportService pdfService,
            IOrdemDeProducaoService ordemService,
            IMovimentacaoService movimentacaoService,
            IProdutoService produtoService,
            IAlmoxarifadoService almoxarifadoService,
            ICategoriaProdutoService categoriaService)
        {
            _pdfService = pdfService;
            _ordemService = ordemService;
            _movimentacaoService = movimentacaoService;
            _produtoService = produtoService;
            _almoxarifadoService = almoxarifadoService;
            _categoriaService = categoriaService;
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
            [FromQuery] DateTime? dataFim,
            [FromQuery] Guid? produtoId,
            [FromQuery] Guid? almoxarifadoId)
        {
            try
            {
                var movimentacoes = await _movimentacaoService.GetAllAsync();

                string textoPeriodo = "Todo o período";
                string textoProduto = "Todos";
                string textoAlmoxarifado = "Todos";

                if (dataInicio.HasValue)
                {
                    movimentacoes = movimentacoes.Where(m => m.DataMovimentacao.Date >= dataInicio.Value.Date);
                    textoPeriodo = $"De {dataInicio.Value:dd/MM/yyyy}";
                }

                if (dataFim.HasValue)
                {
                    movimentacoes = movimentacoes.Where(m => m.DataMovimentacao.Date <= dataFim.Value.Date);
                    textoPeriodo += $" até {dataFim.Value:dd/MM/yyyy}";
                }
                else if (dataInicio.HasValue)
                {
                    textoPeriodo += " até hoje";
                }

                if (produtoId.HasValue)
                {
                    movimentacoes = movimentacoes.Where(m => m.ProdutoId == produtoId.Value);
                    var prod = await _produtoService.GetByIdAsync(produtoId.Value);
                    textoProduto = prod != null ? $"{prod.Nome} ({prod.CodigoInternoProduto})" : "Produto não encontrado";
                }

                if (almoxarifadoId.HasValue)
                {
                    movimentacoes = movimentacoes.Where(m =>
                        m.AlmoxarifadoOrigemId == almoxarifadoId.Value ||
                        m.AlmoxarifadoDestinoId == almoxarifadoId.Value);

                    var almox = await _almoxarifadoService.GetByIdAsync(almoxarifadoId.Value);
                    textoAlmoxarifado = almox != null ? almox.Nome : "Almoxarifado não encontrado";
                }

                var pdfBytes = _pdfService.GerarRelatorioMovimentacoes(
                    movimentacoes,
                    textoPeriodo,
                    textoProduto,
                    textoAlmoxarifado
                );

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
            [FromQuery] bool? apenasAtivos = null,
            [FromQuery] Guid? categoriaId = null)
        {
            try
            {
                var produtos = await _produtoService.GetAllAsync();

                string textoStatus = "Todos";
                string textoCategoria = "Todas";

                if (apenasAtivos.HasValue)
                {
                    produtos = produtos.Where(p => p.Ativo == apenasAtivos.Value);
                    textoStatus = apenasAtivos.Value ? "Apenas Ativos" : "Apenas Inativos";
                }

                if (categoriaId.HasValue)
                {
                    produtos = produtos.Where(p => p.CategoriaProdutoId == categoriaId.Value);
                    var categoria = await _categoriaService.GetByIdAsync(categoriaId.Value);
                    textoCategoria = categoria != null ? categoria.Nome : "Categoria não encontrada";
                }

                var pdfBytes = _pdfService.GerarRelatorioProdutos(produtos, textoStatus, textoCategoria);

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