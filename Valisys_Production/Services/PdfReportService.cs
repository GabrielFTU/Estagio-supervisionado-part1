using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Services
{
   

    public class PdfReportService : IPdfReportService
    {
        public PdfReportService()
        {
            
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public byte[] GerarRelatorioOrdemProducao(OrdemDeProducao ordem)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .AlignCenter()
                        .Text("ORDEM DE PRODUÇÃO")
                        .SemiBold().FontSize(20).FontColor(Colors.Blue.Darken2);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            column.Spacing(10);

                          
                            column.Item().Element(CriarSecao("INFORMAÇÕES DA ORDEM", () =>
                            {
                                return new List<(string Label, string Valor)>
                                {
                                    ("Código:", ordem.CodigoOrdem),
                                    ("Status:", ordem.Status.ToString()),
                                    ("Quantidade:", ordem.Quantidade.ToString()),
                                    ("Data Início:", ordem.DataInicio.ToString("dd/MM/yyyy HH:mm")),
                                    ("Data Fim:", ordem.DataFim?.ToString("dd/MM/yyyy HH:mm") ?? "Em andamento"),
                                    ("Produto:", ordem.Produto?.Nome ?? "N/A"),
                                    ("Almoxarifado:", ordem.Almoxarifado?.Nome ?? "N/A"),
                                    ("Fase Atual:", ordem.FaseAtual?.Nome ?? "N/A"),
                                    ("Lote:", ordem.Lote?.CodigoLote ?? "Sem lote")
                                };
                            }));

                         
                            if (!string.IsNullOrEmpty(ordem.Observacoes))
                            {
                                column.Item().Element(CriarSecao("OBSERVAÇÕES", () =>
                                {
                                    return new List<(string Label, string Valor)>
                                    {
                                        ("", ordem.Observacoes)
                                    };
                                }));
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Página ");
                            x.CurrentPageNumber();
                            x.Span(" de ");
                            x.TotalPages();
                            x.Span(" | ");
                            x.Span($"Gerado em: {DateTime.Now:dd/MM/yyyy HH:mm}");
                        });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GerarRelatorioMovimentacoes(IEnumerable<Movimentacao> movimentacoes)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header()
                        .AlignCenter()
                        .Column(column =>
                        {
                            column.Item().Text("RELATÓRIO DE MOVIMENTAÇÕES")
                                .SemiBold().FontSize(18).FontColor(Colors.Blue.Darken2);
                            column.Item().PaddingTop(5).Text($"Período: {DateTime.Now:dd/MM/yyyy}")
                                .FontSize(10);
                        });

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            column.Spacing(5);

                           
                            column.Item().Row(row =>
                            {
                                row.RelativeItem().Border(1).Padding(10).Column(col =>
                                {
                                    col.Item().Text("Total de Movimentações").Bold();
                                    col.Item().Text(movimentacoes.Count().ToString()).FontSize(16);
                                });
                            });

                            column.Item().PaddingTop(10);

                            
                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(2); 
                                    columns.RelativeColumn(3); 
                                    columns.RelativeColumn(1); 
                                    columns.RelativeColumn(2); 
                                    columns.RelativeColumn(2); 
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(EstiloCelulaCabecalho).Text("Data");
                                    header.Cell().Element(EstiloCelulaCabecalho).Text("Produto");
                                    header.Cell().Element(EstiloCelulaCabecalho).Text("Qtd");
                                    header.Cell().Element(EstiloCelulaCabecalho).Text("Origem");
                                    header.Cell().Element(EstiloCelulaCabecalho).Text("Destino");
                                });

            
                                foreach (var mov in movimentacoes)
                                {
                                    table.Cell().Element(EstiloCelula)
                                        .Text(mov.DataMovimentacao.ToString("dd/MM/yyyy HH:mm"));
                                    table.Cell().Element(EstiloCelula)
                                        .Text(mov.Produto?.Nome ?? "N/A");
                                    table.Cell().Element(EstiloCelula)
                                        .Text(mov.Quantidade.ToString("N2"));
                                    table.Cell().Element(EstiloCelula)
                                        .Text(mov.AlmoxarifadoOrigem?.Nome ?? "N/A");
                                    table.Cell().Element(EstiloCelula)
                                        .Text(mov.AlmoxarifadoDestino?.Nome ?? "N/A");
                                }
                            });
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Página ");
                            x.CurrentPageNumber();
                            x.Span(" de ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GerarRelatorioProdutos(IEnumerable<Produto> produtos)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header()
                        .AlignCenter()
                        .Text("CATÁLOGO DE PRODUTOS")
                        .SemiBold().FontSize(18).FontColor(Colors.Blue.Darken2);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(2); 
                                columns.RelativeColumn(4); 
                                columns.RelativeColumn(3); 
                                columns.RelativeColumn(2); 
                                columns.RelativeColumn(1); 
                            });

                            
                            table.Header(header =>
                            {
                                header.Cell().Element(EstiloCelulaCabecalho).Text("Código");
                                header.Cell().Element(EstiloCelulaCabecalho).Text("Nome");
                                header.Cell().Element(EstiloCelulaCabecalho).Text("Categoria");
                                header.Cell().Element(EstiloCelulaCabecalho).Text("Unidade");
                                header.Cell().Element(EstiloCelulaCabecalho).Text("Status");
                            });

                            
                            foreach (var produto in produtos)
                            {
                                table.Cell().Element(EstiloCelula)
                                    .Text(produto.CodigoInternoProduto);
                                table.Cell().Element(EstiloCelula)
                                    .Text(produto.Nome);
                                table.Cell().Element(EstiloCelula)
                                    .Text(produto.CategoriaProduto?.Nome ?? "N/A");
                                table.Cell().Element(EstiloCelula)
                                    .Text(produto.UnidadeMedida?.Sigla ?? "N/A");
                                table.Cell().Element(EstiloCelula)
                                    .Text(produto.Ativo ? "Ativo" : "Inativo")
                                    .FontColor(produto.Ativo ? Colors.Green.Darken2 : Colors.Red.Darken2);
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Página ");
                            x.CurrentPageNumber();
                            x.Span(" de ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }

        
        private static IContainer EstiloCelulaCabecalho(IContainer container)
        {
            return container
                .Border(1)
                .Background(Colors.Blue.Lighten3)
                .Padding(5)
                .AlignCenter()
                .AlignMiddle();
        }

        private static IContainer EstiloCelula(IContainer container)
        {
            return container
                .Border(1)
                .BorderColor(Colors.Grey.Lighten2)
                .Padding(5)
                .AlignLeft()
                .AlignMiddle();
        }

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