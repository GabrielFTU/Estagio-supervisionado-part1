using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface IPdfReportService
    {
        byte[] GerarRelatorioOrdemProducao(OrdemDeProducao ordem, FichaTecnica? ficha, RoteiroProducao? roteiro);

        byte[] GerarRelatorioMovimentacoes(IEnumerable<Movimentacao> movimentacoes, string periodo, string filtroProduto, string filtroAlmoxarifado);
        byte[] GerarRelatorioProdutos(IEnumerable<Produto> produtos, string filtroStatus, string filtroCategoria);
        byte[] GerarRelatorioProducao(IEnumerable<OrdemDeProducao> ordens, string periodo, string filtroStatus);
    }
}