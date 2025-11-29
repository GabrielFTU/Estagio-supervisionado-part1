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

        public byte[] GerarRelatorioOrdemProducao(OrdemDeProducao ordem, FichaTecnica? ficha, RoteiroProducao? roteiro)
        {
            var logoBytes = CarregarLogo();
            var corPrincipal = Colors.Blue.Darken3;
            var corSecundaria = Colors.Grey.Lighten2;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                    page.Header().Row(row =>
                    {
                        row.RelativeItem(2).Column(col =>
                        {
                            col.Item().Row(r =>
                            {
                                if (logoBytes != null) r.ConstantItem(50).Image(logoBytes);
                                r.RelativeItem().PaddingLeft(10).Column(c =>
                                {
                                    c.Item().Text("Valisys Indústria").Bold().FontSize(14).FontColor(corPrincipal);
                                    c.Item().Text("Documento de Chão de Fábrica").FontSize(9).FontColor(Colors.Grey.Darken2);
                                });
                            });
                        });

                        row.RelativeItem(4).AlignCenter().Column(col =>
                        {
                            col.Item().Text("ORDEM DE PRODUÇÃO").ExtraBold().FontSize(22).FontColor(Colors.Black);
                            var statusColor = ordem.Status == StatusOrdemDeProducao.Ativa ? Colors.Green.Darken2 : Colors.Grey.Darken3;
                            col.Item().Text(ordem.Status.ToString().ToUpper()).Bold().FontSize(12).FontColor(statusColor);
                        });

                        row.RelativeItem(2).Border(1).BorderColor(corSecundaria).Padding(5).Column(col =>
                        {
                            col.Item().Text("NÚMERO DA OP").FontSize(8).FontColor(Colors.Grey.Darken2);
                            col.Item().Text(ordem.CodigoOrdem).Bold().FontSize(12);
                            col.Item().PaddingTop(5).Text("EMISSÃO").FontSize(8).FontColor(Colors.Grey.Darken2);
                            col.Item().Text(DateTime.Now.ToString("dd/MM/yyyy HH:mm")).FontSize(10);
                        });
                    });

                    page.Content().PaddingVertical(10).Column(col =>
                    {
                        col.Item().Border(1).BorderColor(corSecundaria).Row(row =>
                        {
                            row.RelativeItem(3).Padding(10).Column(c =>
                            {
                                c.Item().Text("PRODUTO").FontSize(8).FontColor(Colors.Grey.Darken2).Bold();
                                c.Item().Text($"{ordem.Produto?.CodigoInternoProduto} - {ordem.Produto?.Nome}").FontSize(12).Bold();
                                c.Item().PaddingTop(5).Text(t => {
                                    t.Span("Categoria: ").FontColor(Colors.Grey.Darken3).FontSize(9);
                                    t.Span(ordem.Produto?.CategoriaProduto?.Nome ?? "N/A").Bold().FontSize(9);
                                });
                            });

                            row.RelativeItem(2).Background(Colors.Grey.Lighten5).Padding(10).Column(c =>
                            {
                                c.Item().Row(r => {
                                    r.RelativeItem().Column(cc => {
                                        cc.Item().Text("QUANTIDADE").FontSize(8).Bold();
                                        cc.Item().Text($"{ordem.Quantidade} {ordem.Produto?.UnidadeMedida?.Sigla}").FontSize(14).Bold();
                                    });
                                    r.RelativeItem().Column(cc => {
                                        cc.Item().Text("LOTE DESTINO").FontSize(8).Bold();
                                        cc.Item().Text(ordem.Lote?.CodigoLote ?? "---").FontSize(11);
                                    });
                                });
                                c.Item().PaddingTop(5).LineHorizontal(1).LineColor(Colors.Grey.Lighten3);
                                c.Item().PaddingTop(5).Text($"Data Início: {ordem.DataInicio:dd/MM/yyyy}").FontSize(9);
                                if (ordem.DataFim.HasValue)
                                    c.Item().Text($"Conclusão: {ordem.DataFim:dd/MM/yyyy}").FontSize(9);
                            });
                        });

                        col.Item().Height(15);

                        if (roteiro != null && roteiro.Etapas != null && roteiro.Etapas.Any())
                        {
                            col.Item().Background(corPrincipal).Padding(5).Text($"ROTEIRO DE OPERAÇÕES ({roteiro.Codigo})").Bold().FontColor(Colors.White);

                            col.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(30);
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(4);
                                    columns.ConstantColumn(70);
                                    columns.ConstantColumn(80);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(EstiloCabecalhoCinza).Text("#");
                                    header.Cell().Element(EstiloCabecalhoCinza).Text("FASE / PROCESSO");
                                    header.Cell().Element(EstiloCabecalhoCinza).Text("INSTRUÇÕES TÉCNICAS");
                                    header.Cell().Element(EstiloCabecalhoCinza).AlignCenter().Text("PREVISÃO");
                                    header.Cell().Element(EstiloCabecalhoCinza).AlignCenter().Text("VISTO");
                                });

                                foreach (var etapa in roteiro.Etapas.OrderBy(e => e.Ordem))
                                {
                                    table.Cell().Element(EstiloLinhaBorda).AlignCenter().Text(etapa.Ordem.ToString());
                                    table.Cell().Element(EstiloLinhaBorda).Text(etapa.FaseProducao?.Nome ?? "N/A").Bold();
                                    table.Cell().Element(EstiloLinhaBorda).Text(etapa.Instrucoes ?? "-").FontSize(9);
                                    table.Cell().Element(EstiloLinhaBorda).AlignCenter().Text($"{etapa.TempoDias} dias");
                                    table.Cell().Element(EstiloLinhaBorda);
                                }
                            });
                        }
                        else
                        {
                            col.Item().PaddingVertical(10).AlignCenter().Text("Nenhum roteiro de produção vinculado.").FontColor(Colors.Grey.Darken1).Italic();
                        }

                        col.Item().Height(15);

                        if (ficha != null && ficha.Itens != null && ficha.Itens.Any())
                        {
                            col.Item().Background(Colors.Grey.Darken3).Padding(5).Text("REQUISIÇÃO DE MATERIAIS (PICKING LIST)").Bold().FontColor(Colors.White);

                            col.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(80);
                                    columns.RelativeColumn();
                                    columns.ConstantColumn(50);
                                    columns.ConstantColumn(80);
                                    columns.ConstantColumn(80);
                                    columns.ConstantColumn(60);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(EstiloCabecalhoCinza).Text("CÓDIGO");
                                    header.Cell().Element(EstiloCabecalhoCinza).Text("MATERIAL / COMPONENTE");
                                    header.Cell().Element(EstiloCabecalhoCinza).AlignCenter().Text("UN");
                                    header.Cell().Element(EstiloCabecalhoCinza).AlignRight().Text("QTD UNIT");
                                    header.Cell().Element(EstiloCabecalhoCinza).AlignRight().Text("QTD TOTAL");
                                    header.Cell().Element(EstiloCabecalhoCinza).AlignCenter().Text("CHECK");
                                });

                                foreach (var item in ficha.Itens)
                                {
                                    var qtdTotal = item.Quantidade * ordem.Quantidade;

                                    table.Cell().Element(EstiloLinhaBorda).Text(item.ProdutoComponente?.CodigoInternoProduto ?? "?");
                                    table.Cell().Element(EstiloLinhaBorda).Text(item.ProdutoComponente?.Nome ?? "Item Removido").FontSize(9);
                                    table.Cell().Element(EstiloLinhaBorda).AlignCenter().Text(item.ProdutoComponente?.UnidadeMedida?.Sigla ?? "UN");
                                    table.Cell().Element(EstiloLinhaBorda).AlignRight().Text(item.Quantidade.ToString("N3"));
                                    table.Cell().Element(EstiloLinhaBorda).AlignRight().Text(qtdTotal.ToString("N3")).Bold();
                                    table.Cell().Element(EstiloLinhaBorda).BorderColor(Colors.Grey.Lighten1);
                                }
                            });
                        }
                        else
                        {
                            col.Item().PaddingVertical(10).AlignCenter().Text("Nenhuma lista de materiais vinculada.").FontColor(Colors.Grey.Darken1).Italic();
                        }

                        if (!string.IsNullOrEmpty(ordem.Observacoes))
                        {
                            col.Item().Height(10);
                            col.Item().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Column(c =>
                            {
                                c.Item().Text("OBSERVAÇÕES GERAIS:").Bold().FontSize(8);
                                c.Item().Text(ordem.Observacoes).FontSize(10);
                            });
                        }
                    });

                    page.Footer().Column(col =>
                    {
                        col.Item().PaddingTop(20).Row(row =>
                        {
                            row.RelativeItem().Column(c => {
                                c.Item().PaddingRight(20).BorderBottom(1).BorderColor(Colors.Black);
                                c.Item().PaddingTop(5).AlignCenter().Text("Responsável Produção").FontSize(8);
                            });
                            row.RelativeItem().Column(c => {
                                c.Item().PaddingHorizontal(10).BorderBottom(1).BorderColor(Colors.Black);
                                c.Item().PaddingTop(5).AlignCenter().Text("Controle de Qualidade").FontSize(8);
                            });
                            row.RelativeItem().Column(c => {
                                c.Item().PaddingLeft(20).BorderBottom(1).BorderColor(Colors.Black);
                                c.Item().PaddingTop(5).AlignCenter().Text("Almoxarifado (Baixa)").FontSize(8);
                            });
                        });

                        col.Item().PaddingTop(10).Row(row =>
                        {
                            row.RelativeItem().Text($"Valisys System - Gerado em {DateTime.Now}").FontSize(7).FontColor(Colors.Grey.Medium);
                            row.RelativeItem().AlignRight().Text(x => { x.CurrentPageNumber(); x.Span(" / "); x.TotalPages(); });
                        });
                    });
                });
            });

            return document.GeneratePdf();
        }

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

                        col.Item().PaddingTop(10).PaddingBottom(5).Row(row =>
                        {
                            row.RelativeItem().Text($"Total de O.Ps Listadas: {ordens.Count()}").SemiBold();
                            row.RelativeItem().AlignRight().Text($"Volume Total (Qtd): {ordens.Sum(o => o.Quantidade)} itens").SemiBold().FontColor(Colors.Green.Darken2);
                        });
                    });

                    page.Content().PaddingTop(10).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(80);
                            columns.RelativeColumn(3);
                            columns.RelativeColumn(1);
                            columns.RelativeColumn(1.5f);
                            columns.RelativeColumn(1.5f);
                            columns.RelativeColumn(1.5f);
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

        private static IContainer EstiloCabecalhoCinza(IContainer container)
        {
            return container
                .Background(Colors.Grey.Lighten3)
                .Padding(5)
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Darken1)
                .DefaultTextStyle(x => x.SemiBold().FontSize(8).FontColor(Colors.Black));
        }

        private static IContainer EstiloLinhaBorda(IContainer container)
        {
            return container
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Lighten3)
                .Padding(5);
        }

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
    }
}