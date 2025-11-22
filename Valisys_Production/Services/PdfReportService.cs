using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using System.IO;

namespace Valisys_Production.Services
{
    public class PdfReportService : IPdfReportService
    {
        public PdfReportService()
        {
            QuestPDF.Settings.License = LicenseType.Community;
        }

        // --- PERSONALIZAÇÃO: CARREGAMENTO DA LOGO ---
        private byte[]? CarregarLogo()
        {
            try
            {
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Logo_V.png");
                if (File.Exists(path))
                {
                    return File.ReadAllBytes(path);
                }
            }
            catch { }
            return null;
        }

        // --- RELATÓRIO 1: ORDEM DE PRODUÇÃO (INDIVIDUAL) ---
        public byte[] GerarRelatorioOrdemProducao(OrdemDeProducao ordem)
        {
            var logoBytes = CarregarLogo();
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Arial));

                    page.Header().PaddingBottom(10).Row(row =>
                    {
                        if (logoBytes != null) row.ConstantItem(50).Image(logoBytes);
                        row.RelativeItem().Column(col => {
                            col.Item().AlignCenter().Text("ORDEM DE PRODUÇÃO").SemiBold().FontSize(20).FontColor(Colors.Blue.Darken2);
                            col.Item().AlignCenter().Text($"#{ordem.CodigoOrdem}").FontSize(12).FontColor(Colors.Grey.Darken1);
                        });
                    });

                    page.Content().PaddingVertical(1, Unit.Centimetre).Column(column =>
                    {
                        column.Spacing(10);
                        column.Item().Element(CriarSecao("INFORMAÇÕES DA ORDEM", () => new List<(string, string)>
                        {
                            ("Código:", ordem.CodigoOrdem),
                            ("Status:", ordem.Status.ToString()),
                            ("Quantidade:", $"{ordem.Quantidade} {(ordem.Produto?.UnidadeMedida?.Sigla ?? "UN")}"),
                            ("Data Início:", ordem.DataInicio.ToString("dd/MM/yyyy HH:mm")),
                            ("Produto:", ordem.Produto?.Nome ?? "N/A"),
                            ("Almoxarifado:", ordem.Almoxarifado?.Nome ?? "N/A"),
                            ("Fase Atual:", ordem.FaseAtual?.Nome ?? "N/A"),
                            ("Lote:", ordem.Lote?.CodigoLote ?? "Sem lote")
                        }));

                        if (!string.IsNullOrEmpty(ordem.Observacoes))
                        {
                            column.Item().Element(CriarSecao("OBSERVAÇÕES", () => new List<(string, string)> { ("", ordem.Observacoes) }));
                        }
                    });
                    page.Footer().AlignCenter().Text(x => { x.CurrentPageNumber(); });
                });
            });
            return document.GeneratePdf();
        }

        // --- RELATÓRIO 2: MOVIMENTAÇÕES (Com Filtros) ---
        public byte[] GerarRelatorioMovimentacoes(
            IEnumerable<Movimentacao> movimentacoes,
            string periodo,
            string filtroProduto,
            string filtroAlmoxarifado)
        {
            var logoBytes = CarregarLogo();
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1.5f, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                    // Cabeçalho
                    page.Header().ShowOnce().Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c => {
                                c.Item().Row(logoRow => {
                                    if (logoBytes != null) { logoRow.ConstantItem(40).Image(logoBytes); logoRow.ConstantItem(10); }
                                    logoRow.RelativeItem().PaddingTop(5).Text("Valisys Production").Bold().FontSize(18).FontColor(Colors.Blue.Darken3);
                                });
                            });
                            row.ConstantItem(200).AlignRight().Column(c => {
                                c.Item().Text("RELATÓRIO DE MOVIMENTAÇÕES").Bold().FontSize(12).FontColor(Colors.Grey.Darken3);
                                c.Item().Text($"Emissão: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(9);
                            });
                        });
                        col.Item().PaddingVertical(10).LineHorizontal(2).LineColor(Colors.Blue.Darken3);
                        col.Item().Background(Colors.Grey.Lighten4).Padding(10).Border(1).BorderColor(Colors.Grey.Lighten2).Row(row => {
                            row.RelativeItem().Column(c => { c.Item().Text("Filtros Aplicados:").Bold().FontSize(9).FontColor(Colors.Grey.Darken2); c.Item().Text($"Período: {periodo}").FontSize(10).Bold(); });
                            row.RelativeItem().Column(c => { c.Item().Text(" ").FontSize(9); c.Item().Text($"Produto: {filtroProduto}").FontSize(10); });
                            row.RelativeItem().Column(c => { c.Item().Text(" ").FontSize(9); c.Item().Text($"Local: {filtroAlmoxarifado}").FontSize(10); });
                        });
                        col.Item().PaddingTop(10).PaddingBottom(5).Row(row => { row.RelativeItem().Text($"Total de Registros: {movimentacoes.Count()}").SemiBold(); });
                    });

                    // Tabela
                    page.Content().PaddingTop(10).Table(table =>
                    {
                        table.ColumnsDefinition(columns => {
                            columns.ConstantColumn(85); columns.RelativeColumn(3); columns.RelativeColumn(1); columns.RelativeColumn(2); columns.RelativeColumn(2); columns.RelativeColumn(1.5f);
                        });
                        table.Header(header => {
                            header.Cell().Element(EstiloCabecalhoTabela).Text("DATA/HORA");
                            header.Cell().Element(EstiloCabecalhoTabela).Text("PRODUTO");
                            header.Cell().Element(EstiloCabecalhoTabela).AlignRight().Text("QTD");
                            header.Cell().Element(EstiloCabecalhoTabela).Text("ORIGEM");
                            header.Cell().Element(EstiloCabecalhoTabela).Text("DESTINO");
                            header.Cell().Element(EstiloCabecalhoTabela).Text("USUÁRIO");
                        });
                        var i = 0;
                        foreach (var mov in movimentacoes)
                        {
                            Func<IContainer, IContainer> style = (i % 2 == 0) ? EstiloLinhaPar : EstiloLinhaImpar;
                            table.Cell().Element(style).Text(mov.DataMovimentacao.ToString("dd/MM HH:mm"));
                            table.Cell().Element(style).Text(mov.Produto?.Nome ?? "N/A").SemiBold();
                            table.Cell().Element(style).AlignRight().Text(mov.Quantidade.ToString("N2"));
                            table.Cell().Element(style).Text(mov.AlmoxarifadoOrigem?.Nome ?? "-");
                            table.Cell().Element(style).Text(mov.AlmoxarifadoDestino?.Nome ?? "-");
                            table.Cell().Element(style).Text(mov.Usuario?.Nome ?? "Sistema").FontColor(Colors.Grey.Darken2).FontSize(9);
                            i++;
                        }
                        table.Footer(footer => { footer.Cell().ColumnSpan(6).PaddingTop(2).LineHorizontal(1).LineColor(Colors.Blue.Darken3); });
                    });
                    page.Footer().PaddingTop(20).AlignCenter().Row(row => { row.RelativeItem().Column(c => { c.Item().Text("Relatório gerado automaticamente pelo sistema Valisys.").FontSize(8).FontColor(Colors.Grey.Darken1).AlignCenter(); c.Item().Text(x => { x.Span("Página "); x.CurrentPageNumber(); x.Span(" de "); x.TotalPages(); }); }); });
                });
            });
            return document.GeneratePdf();
        }

        // --- RELATÓRIO 3: CATÁLOGO DE PRODUTOS (Com Filtros) ---
        public byte[] GerarRelatorioProdutos(IEnumerable<Produto> produtos, string filtroStatus, string filtroCategoria)
        {
            var logoBytes = CarregarLogo();
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1.5f, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                    page.Header().ShowOnce().Column(col => {
                        col.Item().Row(row => {
                            row.RelativeItem().Column(c => { c.Item().Row(logoRow => { if (logoBytes != null) { logoRow.ConstantItem(40).Image(logoBytes); logoRow.ConstantItem(10); } logoRow.RelativeItem().PaddingTop(5).Text("Valisys Production").Bold().FontSize(18).FontColor(Colors.Blue.Darken3); }); });
                            row.ConstantItem(200).AlignRight().Column(c => { c.Item().Text("CATÁLOGO DE PRODUTOS").Bold().FontSize(12).FontColor(Colors.Grey.Darken3); c.Item().Text($"Emissão: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(9); });
                        });
                        col.Item().PaddingVertical(10).LineHorizontal(2).LineColor(Colors.Blue.Darken3);
                        col.Item().Background(Colors.Grey.Lighten4).Padding(10).Border(1).BorderColor(Colors.Grey.Lighten2).Row(row => {
                            row.RelativeItem().Column(c => { c.Item().Text("Filtros Aplicados:").Bold().FontSize(9).FontColor(Colors.Grey.Darken2); c.Item().Text($"Status: {filtroStatus}").FontSize(10).Bold(); });
                            row.RelativeItem().Column(c => { c.Item().Text(" ").FontSize(9); c.Item().Text($"Categoria: {filtroCategoria}").FontSize(10).Bold(); });
                        });
                        col.Item().PaddingTop(10).PaddingBottom(5).Row(row => { row.RelativeItem().Text($"Total de Produtos: {produtos.Count()}").SemiBold(); });
                    });

                    page.Content().PaddingTop(10).Table(table =>
                    {
                        table.ColumnsDefinition(columns => { columns.RelativeColumn(2); columns.RelativeColumn(4); columns.RelativeColumn(3); columns.RelativeColumn(2); columns.RelativeColumn(1.5f); });
                        table.Header(header => {
                            header.Cell().Element(EstiloCabecalhoTabela).Text("CÓDIGO"); header.Cell().Element(EstiloCabecalhoTabela).Text("NOME"); header.Cell().Element(EstiloCabecalhoTabela).Text("CATEGORIA"); header.Cell().Element(EstiloCabecalhoTabela).Text("UNIDADE"); header.Cell().Element(EstiloCabecalhoTabela).Text("STATUS");
                        });
                        var i = 0;
                        foreach (var produto in produtos)
                        {
                            Func<IContainer, IContainer> style = (i % 2 == 0) ? EstiloLinhaPar : EstiloLinhaImpar;
                            table.Cell().Element(style).Text(produto.CodigoInternoProduto).Bold();
                            table.Cell().Element(style).Text(produto.Nome);
                            table.Cell().Element(style).Text(produto.CategoriaProduto?.Nome ?? "N/A");
                            table.Cell().Element(style).Text(produto.UnidadeMedida?.Sigla ?? "N/A");
                            table.Cell().Element(style).Text(produto.Ativo ? "Ativo" : "Inativo").FontColor(produto.Ativo ? Colors.Green.Darken2 : Colors.Red.Darken2).Bold();
                            i++;
                        }
                        table.Footer(footer => { footer.Cell().ColumnSpan(5).PaddingTop(2).LineHorizontal(1).LineColor(Colors.Blue.Darken3); });
                    });
                    page.Footer().PaddingTop(20).AlignCenter().Row(row => { row.RelativeItem().Column(c => { c.Item().Text("Relatório gerado automaticamente pelo sistema Valisys.").FontSize(8).FontColor(Colors.Grey.Darken1).AlignCenter(); c.Item().Text(x => { x.Span("Página "); x.CurrentPageNumber(); x.Span(" de "); x.TotalPages(); }); }); });
                });
            });
            return document.GeneratePdf();
        }

        // --- RELATÓRIO 4: PRODUÇÃO POR PERÍODO (Com Filtros) ---
        public byte[] GerarRelatorioProducao(
            IEnumerable<OrdemDeProducao> ordens,
            string periodo,
            string filtroStatus)
        {
            var logoBytes = CarregarLogo();
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1.5f, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                    // Cabeçalho
                    page.Header().ShowOnce().Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Row(logoRow =>
                                {
                                    if (logoBytes != null)
                                    {
                                        logoRow.ConstantItem(40).Image(logoBytes);
                                        logoRow.ConstantItem(10);
                                    }
                                    logoRow.RelativeItem().PaddingTop(5).Text("Valisys Production").Bold().FontSize(18).FontColor(Colors.Blue.Darken3);
                                });
                            });

                            row.ConstantItem(200).AlignRight().Column(c =>
                            {
                                c.Item().Text("RELATÓRIO DE PRODUÇÃO").Bold().FontSize(12).FontColor(Colors.Grey.Darken3);
                                c.Item().Text($"Emissão: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(9);
                            });
                        });

                        col.Item().PaddingVertical(10).LineHorizontal(2).LineColor(Colors.Blue.Darken3);

                        // Box de Filtros
                        col.Item().Background(Colors.Grey.Lighten4).Padding(10).Border(1).BorderColor(Colors.Grey.Lighten2).Row(row =>
                        {
                            row.RelativeItem().Column(c => {
                                c.Item().Text("Filtros Aplicados:").Bold().FontSize(9).FontColor(Colors.Grey.Darken2);
                                c.Item().Text($"Período: {periodo}").FontSize(10).Bold();
                            });

                            row.RelativeItem().Column(c => {
                                c.Item().Text(" ").FontSize(9);
                                c.Item().Text($"Status: {filtroStatus}").FontSize(10).Bold();
                            });
                        });

                        // Resumo Totalizador
                        col.Item().PaddingTop(10).PaddingBottom(5).Row(row =>
                        {
                            row.RelativeItem().Text($"Total de O.Ps Listadas: {ordens.Count()}").SemiBold();
                            row.RelativeItem().AlignRight().Text($"Volume Total (Qtd): {ordens.Sum(o => o.Quantidade)} itens").SemiBold().FontColor(Colors.Green.Darken2);
                        });
                    });

                    // Tabela
                    page.Content().PaddingTop(10).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(80);   // Código
                            columns.RelativeColumn(3);    // Produto
                            columns.RelativeColumn(1);    // Qtd
                            columns.RelativeColumn(1.5f); // Início
                            columns.RelativeColumn(1.5f); // Fim
                            columns.RelativeColumn(1.5f); // Status
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(EstiloCabecalhoTabela).Text("CÓDIGO OP");
                            header.Cell().Element(EstiloCabecalhoTabela).Text("PRODUTO");
                            header.Cell().Element(EstiloCabecalhoTabela).AlignRight().Text("QTD");
                            header.Cell().Element(EstiloCabecalhoTabela).Text("INÍCIO");
                            header.Cell().Element(EstiloCabecalhoTabela).Text("CONCLUSÃO");
                            header.Cell().Element(EstiloCabecalhoTabela).Text("STATUS");
                        });

                        var i = 0;
                        foreach (var op in ordens)
                        {
                            Func<IContainer, IContainer> style = (i % 2 == 0) ? EstiloLinhaPar : EstiloLinhaImpar;

                            table.Cell().Element(style).Text(op.CodigoOrdem).Bold();
                            table.Cell().Element(style).Text(op.Produto?.Nome ?? "N/A");
                            table.Cell().Element(style).AlignRight().Text(op.Quantidade.ToString());
                            table.Cell().Element(style).Text(op.DataInicio.ToString("dd/MM/yy HH:mm"));

                            var dataFim = op.DataFim.HasValue ? op.DataFim.Value.ToString("dd/MM/yy HH:mm") : "-";
                            table.Cell().Element(style).Text(dataFim);

                            string corStatus = Colors.Grey.Darken3;
                            if (op.Status == StatusOrdemDeProducao.Ativa) corStatus = Colors.Blue.Medium;
                            if (op.Status == StatusOrdemDeProducao.Finalizada) corStatus = Colors.Green.Darken2;
                            if (op.Status == StatusOrdemDeProducao.Cancelada) corStatus = Colors.Red.Medium;
                            if (op.Status == StatusOrdemDeProducao.Aguardando) corStatus = Colors.Orange.Darken2;

                            table.Cell().Element(style).Text(op.Status.ToString()).FontColor(corStatus).Bold();

                            i++;
                        }

                        table.Footer(footer =>
                        {
                            footer.Cell().ColumnSpan(6).PaddingTop(2).LineHorizontal(1).LineColor(Colors.Blue.Darken3);
                        });
                    });

                    page.Footer().PaddingTop(20).AlignCenter().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Relatório gerado automaticamente pelo sistema Valisys.").FontSize(8).FontColor(Colors.Grey.Darken1).AlignCenter();
                            c.Item().Text(x =>
                            {
                                x.Span("Página ");
                                x.CurrentPageNumber();
                                x.Span(" de ");
                                x.TotalPages();
                            });
                        });
                    });
                });
            });

            return document.GeneratePdf();
        }

        // --- ESTILOS E HELPERS ---

        private static IContainer EstiloCelulaCabecalho(IContainer container) => container.Border(1).Background(Colors.Blue.Lighten3).Padding(5).AlignCenter().AlignMiddle();
        private static IContainer EstiloCelula(IContainer container) => container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(5).AlignLeft().AlignMiddle();

        private static IContainer EstiloCabecalhoTabela(IContainer container)
        {
            return container
                .Background(Colors.Blue.Darken3)
                .PaddingVertical(5)
                .PaddingHorizontal(5)
                .DefaultTextStyle(x => x.SemiBold().FontColor(Colors.White).FontSize(9));
        }

        private static IContainer EstiloLinhaImpar(IContainer container) => container.Background(Colors.Grey.Lighten4).Padding(5).BorderBottom(1).BorderColor(Colors.White);
        private static IContainer EstiloLinhaPar(IContainer container) => container.Background(Colors.White).Padding(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten4);

        private static Action<IContainer> CriarSecao(string titulo, Func<List<(string Label, string Valor)>> campos)
        {
            return container =>
            {
                container.Border(1).BorderColor(Colors.Grey.Medium).Padding(10).Column(column =>
                {
                    column.Spacing(5);
                    column.Item().Text(titulo).Bold().FontSize(12);
                    column.Item().LineHorizontal(1).LineColor(Colors.Grey.Medium);

                    foreach (var (label, valor) in campos())
                    {
                        column.Item().Row(row =>
                        {
                            if (!string.IsNullOrEmpty(label))
                            {
                                row.ConstantItem(150).Text(label).Bold();
                            }
                            row.RelativeItem().Text(valor);
                        });
                    }
                });
            };
        }
    }
}