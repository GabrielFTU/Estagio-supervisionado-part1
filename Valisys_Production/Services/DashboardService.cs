using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.DTOs;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Valisys_Production.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetStatsAsync()
        {
            var stats = new DashboardStatsDto();

            stats.TotalOpsAtivas = await _context.OrdensDeProducao
                .CountAsync(o => o.Status == StatusOrdemDeProducao.Ativa || o.Status == StatusOrdemDeProducao.Aguardando);

            stats.TotalOpsFinalizadas = await _context.OrdensDeProducao
                .CountAsync(o => o.Status == StatusOrdemDeProducao.Finalizada);

            stats.TotalLotesAtivos = await _context.Lotes
                .CountAsync(l => l.statusLote == StatusLote.Pendente || l.statusLote == StatusLote.EmProducao);

            var opsAtivas = await _context.OrdensDeProducao
                .AsNoTracking()
                .Include(o => o.Produto)
                .Include(o => o.FaseAtual)
                .Include(o => o.RoteiroProducao)
                    .ThenInclude(r => r.Etapas)
                .Where(o => o.Status == StatusOrdemDeProducao.Ativa)
                .ToListAsync();

            var ordensAtrasadas = new List<OrdemAtrasadaDto>();

            foreach (var op in opsAtivas)
            {
                int diasEstimados = (op.RoteiroProducao != null && op.RoteiroProducao.Etapas.Any())
                    ? op.RoteiroProducao.Etapas.Sum(e => e.TempoDias)
                    : 7; 

                var dataEntregaPrevista = op.DataInicio.AddDays(diasEstimados);

                if (DateTime.UtcNow > dataEntregaPrevista)
                {
                    ordensAtrasadas.Add(new OrdemAtrasadaDto
                    {
                        Codigo = op.CodigoOrdem,
                        Produto = op.Produto.Nome,
                        Fase = op.FaseAtual.Nome,
                        DiasAtraso = (DateTime.UtcNow - dataEntregaPrevista).Days
                    });
                }
            }

            stats.TotalOpsAtrasadas = ordensAtrasadas.Count;
            stats.OrdensCriticas = ordensAtrasadas
                .OrderByDescending(x => x.DiasAtraso)
                .Take(5)
                .ToList();

            var opsFinalizadas = await _context.OrdensDeProducao
                .Where(o => o.Status == StatusOrdemDeProducao.Finalizada && o.DataFim.HasValue)
                .Select(o => new { Inicio = o.DataInicio, Fim = o.DataFim.Value })
                .ToListAsync();

            if (opsFinalizadas.Any())
            {
                stats.TempoMedioProducao = opsFinalizadas.Average(x => (x.Fim - x.Inicio).TotalDays);
            }

            // 4. Gráficos (Gargalos e Histórico)
            var opsPorFase = await _context.OrdensDeProducao
                .Where(o => o.Status == StatusOrdemDeProducao.Ativa)
                .Include(o => o.FaseAtual)
                .GroupBy(o => o.FaseAtual.Nome)
                .Select(g => new { Fase = g.Key, Qtd = g.Count() })
                .ToListAsync();

            stats.OpsPorFase = opsPorFase
                .Select(x => new GraficoDadosDto { Nome = x.Fase, Valor = x.Qtd })
                .OrderByDescending(x => x.Valor)
                .ToList();

            var dataLimite = DateTime.UtcNow.AddMonths(-6);
            var opsPorMes = await _context.OrdensDeProducao
                .Where(o => o.Status == StatusOrdemDeProducao.Finalizada && o.DataFim >= dataLimite)
                .GroupBy(o => new { o.DataFim.Value.Year, o.DataFim.Value.Month })
                .Select(g => new {
                    Ano = g.Key.Year,
                    Mes = g.Key.Month,
                    Qtd = g.Count()
                })
                .OrderBy(x => x.Ano).ThenBy(x => x.Mes)
                .ToListAsync();

            stats.OpsPorMes = opsPorMes
                .Select(x => new GraficoDadosDto { Nome = $"{x.Mes:D2}/{x.Ano}", Valor = x.Qtd })
                .ToList();

            var ultimasMovs = await _context.Movimentacoes
                .AsNoTracking()
                .Include(m => m.Produto)
                .Include(m => m.Usuario)
                .Include(m => m.AlmoxarifadoOrigem)
                .Include(m => m.AlmoxarifadoDestino)
                .OrderByDescending(m => m.DataMovimentacao)
                .Take(6)
                .ToListAsync();

            stats.UltimasMovimentacoes = ultimasMovs.Select(m => new MovimentacaoRecenteDto
            {
                Descricao = $"{m.Quantidade:N0}x {m.Produto.Nome}",
                Tipo = m.OrdemDeProducaoId != Guid.Empty ? "Produção" : "Estoque",
                Usuario = m.Usuario.Nome,
                Data = m.DataMovimentacao
            }).ToList();

            return stats;
        }
    }
}