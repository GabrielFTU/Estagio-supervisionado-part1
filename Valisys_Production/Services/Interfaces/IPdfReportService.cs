using Valisys_Production.Models;

namespace Valisys_Production.Services.Interfaces
{
    public interface IPdfReportService
    {
        byte[] GerarRelatorioOrdemProducao(OrdemDeProducao ordem);
        byte[] GerarRelatorioMovimentacoes(IEnumerable<Movimentacao> movimentacoes);
        byte[] GerarRelatorioProdutos(IEnumerable<Produto> produtos);
    }
}
