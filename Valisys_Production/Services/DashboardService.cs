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

            stats.TotalProdutos = await _context.Produtos
                .CountAsync(p => p.Ativo);

            stats.TotalLotesAtivos = await _context.Lotes
                .CountAsync(l => l.statusLote == StatusLote.Pendente || l.statusLote == StatusLote.EmProducao);

            var opsPorFase = await _context.OrdensDeProducao
                .Where(o => o.Status == StatusOrdemDeProducao.Ativa)
                .Include(o => o.FaseAtual)
                .GroupBy(o => o.FaseAtual.Nome)
                .Select(g => new { Fase = g.Key, Qtd = g.Count() })
                .ToListAsync();

            stats.OpsPorFase = opsPorFase
                .Select(x => new GraficoDadosDto { Nome = x.Fase, Valor = x.Qtd })
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
                .Select(x => new GraficoDadosDto
                {
                    Nome = $"{x.Mes}/{x.Ano}",
                    Valor = x.Qtd
                })
                .ToList();

            return stats;
        }
    }
}