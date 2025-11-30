using System;
using System.Collections.Generic;

namespace Valisys_Production.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalOpsAtivas { get; set; }
        public int TotalOpsFinalizadas { get; set; }
        public int TotalOpsAtrasadas { get; set; } 
        public int TotalLotesAtivos { get; set; }
        public double TempoMedioProducao { get; set; }

        public List<GraficoDadosDto> OpsPorFase { get; set; }
        public List<GraficoDadosDto> OpsPorMes { get; set; }
        
        public List<OrdemAtrasadaDto> OrdensCriticas { get; set; } 
        public List<MovimentacaoRecenteDto> UltimasMovimentacoes { get; set; }
    }

    public class GraficoDadosDto
    {
        public string Nome { get; set; }
        public int Valor { get; set; }
    }

    public class OrdemAtrasadaDto
    {
        public string Codigo { get; set; }
        public string Produto { get; set; }
        public string Fase { get; set; }
        public int DiasAtraso { get; set; }
    }

    public class MovimentacaoRecenteDto
    {
        public string Descricao { get; set; }
        public string Tipo { get; set; }
        public string Usuario { get; set; }
        public DateTime Data { get; set; }
    }
}