namespace Valisys_Production.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalOpsAtivas { get; set; }
        public int TotalOpsFinalizadas { get; set; }
        public int TotalProdutos { get; set; }
        public int TotalLotesAtivos { get; set; }

        public List<GraficoDadosDto> OpsPorFase { get; set; }
        public List<GraficoDadosDto> OpsPorMes { get; set; }
    }

    public class GraficoDadosDto
    {
        public string Nome { get; set; }
        public int Valor { get; set; }
    }
}