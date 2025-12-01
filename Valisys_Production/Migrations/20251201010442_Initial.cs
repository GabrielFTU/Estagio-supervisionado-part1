using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Valisys_Production.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Almoxarifados",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Descricao = table.Column<string>(type: "text", nullable: false),
                    Localizacao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Responsavel = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Contato = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Almoxarifados", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CategoriasProduto",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriasProduto", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FasesProducao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Ordem = table.Column<int>(type: "integer", nullable: false),
                    TempoPadraoDias = table.Column<int>(type: "integer", nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FasesProducao", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fornecedores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Documento = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    TipoDocumento = table.Column<int>(type: "integer", nullable: false),
                    Endereco = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Telefone = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fornecedores", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Perfis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    Acessos = table.Column<List<string>>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Perfis", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TiposDeOrdemDeProducao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Codigo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposDeOrdemDeProducao", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UnidadesMedida",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Sigla = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Grandeza = table.Column<int>(type: "integer", nullable: false),
                    FatorConversao = table.Column<decimal>(type: "numeric", nullable: false),
                    EhUnidadeBase = table.Column<bool>(type: "boolean", nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnidadesMedida", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SenhaHash = table.Column<string>(type: "text", nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    PerfilId = table.Column<Guid>(type: "uuid", nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuarios_Perfis_PerfilId",
                        column: x => x.PerfilId,
                        principalTable: "Perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Produtos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    CodigoInternoProduto = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Classificacao = table.Column<int>(type: "integer", nullable: false),
                    ControlarPorLote = table.Column<bool>(type: "boolean", nullable: false),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UnidadeMedidaId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoriaProdutoId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produtos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Produtos_CategoriasProduto_CategoriaProdutoId",
                        column: x => x.CategoriaProdutoId,
                        principalTable: "CategoriasProduto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Produtos_UnidadesMedida_UnidadeMedidaId",
                        column: x => x.UnidadeMedidaId,
                        principalTable: "UnidadesMedida",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LogsSistema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: true),
                    Acao = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Modulo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Detalhes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    DataHora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogsSistema", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogsSistema_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "FichasTecnicas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProdutoId = table.Column<Guid>(type: "uuid", nullable: false),
                    CodigoFicha = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Versao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Ativa = table.Column<bool>(type: "boolean", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FichasTecnicas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FichasTecnicas_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Lotes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CodigoLote = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    statusLote = table.Column<int>(type: "integer", nullable: false),
                    DataAbertura = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataConclusao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ProdutoId = table.Column<Guid>(type: "uuid", nullable: false),
                    AlmoxarifadoId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lotes_Almoxarifados_AlmoxarifadoId",
                        column: x => x.AlmoxarifadoId,
                        principalTable: "Almoxarifados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Lotes_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoteirosProducao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Versao = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ProdutoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoteirosProducao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoteirosProducao_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SolicitacoesProducao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CodigoSolicitacao = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DataSolicitacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataAprovacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    EncarregadoId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioAprovacaoId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProdutoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Quantidade = table.Column<int>(type: "integer", nullable: false),
                    TipoOrdemDeProducaoId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitacoesProducao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolicitacoesProducao_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitacoesProducao_TiposDeOrdemDeProducao_TipoOrdemDeProd~",
                        column: x => x.TipoOrdemDeProducaoId,
                        principalTable: "TiposDeOrdemDeProducao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitacoesProducao_Usuarios_EncarregadoId",
                        column: x => x.EncarregadoId,
                        principalTable: "Usuarios",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SolicitacoesProducao_Usuarios_UsuarioAprovacaoId",
                        column: x => x.UsuarioAprovacaoId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FichaTecnicaItens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FichaTecnicaId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProdutoComponenteId = table.Column<Guid>(type: "uuid", nullable: false),
                    Quantidade = table.Column<decimal>(type: "numeric", nullable: false),
                    PerdaPercentual = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FichaTecnicaItens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FichaTecnicaItens_FichasTecnicas_FichaTecnicaId",
                        column: x => x.FichaTecnicaId,
                        principalTable: "FichasTecnicas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FichaTecnicaItens_Produtos_ProdutoComponenteId",
                        column: x => x.ProdutoComponenteId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RoteiroProducaoEtapas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RoteiroProducaoId = table.Column<Guid>(type: "uuid", nullable: false),
                    FaseProducaoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Ordem = table.Column<int>(type: "integer", nullable: false),
                    TempoDias = table.Column<int>(type: "integer", nullable: false),
                    Instrucoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoteiroProducaoEtapas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoteiroProducaoEtapas_FasesProducao_FaseProducaoId",
                        column: x => x.FaseProducaoId,
                        principalTable: "FasesProducao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoteiroProducaoEtapas_RoteirosProducao_RoteiroProducaoId",
                        column: x => x.RoteiroProducaoId,
                        principalTable: "RoteirosProducao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrdensDeProducao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CodigoOrdem = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Quantidade = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DataInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataFim = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ProdutoId = table.Column<Guid>(type: "uuid", nullable: false),
                    AlmoxarifadoId = table.Column<Guid>(type: "uuid", nullable: false),
                    FaseAtualId = table.Column<Guid>(type: "uuid", nullable: false),
                    LoteId = table.Column<Guid>(type: "uuid", nullable: true),
                    RoteiroProducaoId = table.Column<Guid>(type: "uuid", nullable: true),
                    TipoOrdemDeProducaoId = table.Column<Guid>(type: "uuid", nullable: false),
                    SolicitacaoProducaoId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdensDeProducao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrdensDeProducao_Almoxarifados_AlmoxarifadoId",
                        column: x => x.AlmoxarifadoId,
                        principalTable: "Almoxarifados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdensDeProducao_FasesProducao_FaseAtualId",
                        column: x => x.FaseAtualId,
                        principalTable: "FasesProducao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdensDeProducao_Lotes_LoteId",
                        column: x => x.LoteId,
                        principalTable: "Lotes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OrdensDeProducao_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdensDeProducao_RoteirosProducao_RoteiroProducaoId",
                        column: x => x.RoteiroProducaoId,
                        principalTable: "RoteirosProducao",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OrdensDeProducao_SolicitacoesProducao_SolicitacaoProducaoId",
                        column: x => x.SolicitacaoProducaoId,
                        principalTable: "SolicitacoesProducao",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OrdensDeProducao_TiposDeOrdemDeProducao_TipoOrdemDeProducao~",
                        column: x => x.TipoOrdemDeProducaoId,
                        principalTable: "TiposDeOrdemDeProducao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SolicitacaoProducaoItens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SolicitacaoProducaoId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProdutoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Quantidade = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitacaoProducaoItens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolicitacaoProducaoItens_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitacaoProducaoItens_SolicitacoesProducao_SolicitacaoPr~",
                        column: x => x.SolicitacaoProducaoId,
                        principalTable: "SolicitacoesProducao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Movimentacoes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DataMovimentacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ProdutoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Quantidade = table.Column<decimal>(type: "numeric", nullable: false),
                    OrdemDeProducaoId = table.Column<Guid>(type: "uuid", nullable: false),
                    AlmoxarifadoOrigemId = table.Column<Guid>(type: "uuid", nullable: false),
                    AlmoxarifadoDestinoId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movimentacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Movimentacoes_Almoxarifados_AlmoxarifadoDestinoId",
                        column: x => x.AlmoxarifadoDestinoId,
                        principalTable: "Almoxarifados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Movimentacoes_Almoxarifados_AlmoxarifadoOrigemId",
                        column: x => x.AlmoxarifadoOrigemId,
                        principalTable: "Almoxarifados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Movimentacoes_OrdensDeProducao_OrdemDeProducaoId",
                        column: x => x.OrdemDeProducaoId,
                        principalTable: "OrdensDeProducao",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Movimentacoes_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Movimentacoes_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Almoxarifados",
                columns: new[] { "Id", "Ativo", "Contato", "DataCadastro", "Descricao", "Email", "Localizacao", "Nome", "Responsavel" },
                values: new object[] { new Guid("c0de0000-0000-0000-0000-000000000009"), true, "(67) 99999-9999", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Almoxarifado principal", "almoxarifado@empresa.com", "Galpão 1", "Almoxarifado Geral", "Sistema" });

            migrationBuilder.InsertData(
                table: "Perfis",
                columns: new[] { "Id", "Acessos", "Ativo", "Nome" },
                values: new object[] { new Guid("c0de0000-0000-0000-0000-000000000001"), new List<string>(), true, "Administrador" });

            migrationBuilder.InsertData(
                table: "UnidadesMedida",
                columns: new[] { "Id", "Ativo", "EhUnidadeBase", "FatorConversao", "Grandeza", "Nome", "Sigla" },
                values: new object[,]
                {
                    { new Guid("c0de0000-0000-0000-0000-000000000002"), true, true, 1m, 0, "Unidade", "UN" },
                    { new Guid("c0de0000-0000-0000-0000-000000000003"), true, true, 1m, 1, "Kilograma", "KG" },
                    { new Guid("c0de0000-0000-0000-0000-000000000012"), true, true, 1m, 2, "Metro", "M" },
                    { new Guid("c0de0000-0000-0000-0000-000000000020"), true, false, 1m, 0, "Peça", "PC" },
                    { new Guid("c0de0000-0000-0000-0000-000000000021"), true, false, 1m, 0, "Caixa", "CX" },
                    { new Guid("c0de0000-0000-0000-0000-000000000022"), true, false, 1m, 0, "Kit", "KIT" },
                    { new Guid("c0de0000-0000-0000-0000-000000000023"), true, false, 12m, 0, "Dúzia", "DZ" },
                    { new Guid("c0de0000-0000-0000-0000-000000000024"), true, false, 1000m, 0, "Milheiro", "MIL" },
                    { new Guid("c0de0000-0000-0000-0000-000000000031"), true, false, 0.000001m, 1, "Miligrama", "MG" },
                    { new Guid("c0de0000-0000-0000-0000-000000000032"), true, false, 1000m, 1, "Tonelada", "TON" },
                    { new Guid("c0de0000-0000-0000-0000-000000000040"), true, false, 0.01m, 2, "Centímetro", "CM" },
                    { new Guid("c0de0000-0000-0000-0000-000000000041"), true, false, 0.001m, 2, "Milímetro", "MM" },
                    { new Guid("c0de0000-0000-0000-0000-000000000042"), true, false, 1000m, 2, "Quilômetro", "KM" },
                    { new Guid("c0de0000-0000-0000-0000-000000000050"), true, true, 1m, 3, "Litro", "L" },
                    { new Guid("c0de0000-0000-0000-0000-000000000051"), true, false, 0.001m, 3, "Mililitro", "ML" },
                    { new Guid("c0de0000-0000-0000-0000-000000000052"), true, false, 1000m, 3, "Metro Cúbico", "M3" },
                    { new Guid("c0de0000-0000-0000-0000-000000000060"), true, true, 1m, 5, "Metro Quadrado", "M2" },
                    { new Guid("c0de0000-0000-0000-0000-000000000061"), true, false, 0.0001m, 5, "Centímetro Quadrado", "CM2" },
                    { new Guid("c0de0000-0000-0000-0000-000000000070"), true, true, 1m, 4, "Hora", "H" },
                    { new Guid("c0de0000-0000-0000-0000-000000000071"), true, false, 0.0166667m, 4, "Minuto", "MIN" },
                    { new Guid("c0de0000-0000-0000-0000-000000000099"), true, false, 0.001m, 1, "Grama", "G" }
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Ativo", "DataCadastro", "Email", "Nome", "PerfilId", "SenhaHash" },
                values: new object[] { new Guid("c0de0000-0000-0000-0000-000000000000"), true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@valisys.com", "Administrador Master", new Guid("c0de0000-0000-0000-0000-000000000001"), "$2a$12$ceV2TtMQV.UXqYGXoyMt.eV9s2YcTh0SVykcjMPxxDxjci9hoYzeG" });

            migrationBuilder.CreateIndex(
                name: "IX_CategoriasProduto_Codigo",
                table: "CategoriasProduto",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FichasTecnicas_ProdutoId",
                table: "FichasTecnicas",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_FichaTecnicaItens_FichaTecnicaId",
                table: "FichaTecnicaItens",
                column: "FichaTecnicaId");

            migrationBuilder.CreateIndex(
                name: "IX_FichaTecnicaItens_ProdutoComponenteId",
                table: "FichaTecnicaItens",
                column: "ProdutoComponenteId");

            migrationBuilder.CreateIndex(
                name: "IX_LogsSistema_UsuarioId",
                table: "LogsSistema",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Lotes_AlmoxarifadoId",
                table: "Lotes",
                column: "AlmoxarifadoId");

            migrationBuilder.CreateIndex(
                name: "IX_Lotes_ProdutoId",
                table: "Lotes",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacoes_AlmoxarifadoDestinoId",
                table: "Movimentacoes",
                column: "AlmoxarifadoDestinoId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacoes_AlmoxarifadoOrigemId",
                table: "Movimentacoes",
                column: "AlmoxarifadoOrigemId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacoes_OrdemDeProducaoId",
                table: "Movimentacoes",
                column: "OrdemDeProducaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacoes_ProdutoId",
                table: "Movimentacoes",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacoes_UsuarioId",
                table: "Movimentacoes",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeProducao_AlmoxarifadoId",
                table: "OrdensDeProducao",
                column: "AlmoxarifadoId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeProducao_FaseAtualId",
                table: "OrdensDeProducao",
                column: "FaseAtualId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeProducao_LoteId",
                table: "OrdensDeProducao",
                column: "LoteId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeProducao_ProdutoId",
                table: "OrdensDeProducao",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeProducao_RoteiroProducaoId",
                table: "OrdensDeProducao",
                column: "RoteiroProducaoId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeProducao_SolicitacaoProducaoId",
                table: "OrdensDeProducao",
                column: "SolicitacaoProducaoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeProducao_TipoOrdemDeProducaoId",
                table: "OrdensDeProducao",
                column: "TipoOrdemDeProducaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Produtos_CategoriaProdutoId",
                table: "Produtos",
                column: "CategoriaProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_Produtos_CodigoInternoProduto",
                table: "Produtos",
                column: "CodigoInternoProduto",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Produtos_UnidadeMedidaId",
                table: "Produtos",
                column: "UnidadeMedidaId");

            migrationBuilder.CreateIndex(
                name: "IX_RoteiroProducaoEtapas_FaseProducaoId",
                table: "RoteiroProducaoEtapas",
                column: "FaseProducaoId");

            migrationBuilder.CreateIndex(
                name: "IX_RoteiroProducaoEtapas_RoteiroProducaoId",
                table: "RoteiroProducaoEtapas",
                column: "RoteiroProducaoId");

            migrationBuilder.CreateIndex(
                name: "IX_RoteirosProducao_ProdutoId",
                table: "RoteirosProducao",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacaoProducaoItens_ProdutoId",
                table: "SolicitacaoProducaoItens",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacaoProducaoItens_SolicitacaoProducaoId",
                table: "SolicitacaoProducaoItens",
                column: "SolicitacaoProducaoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacoesProducao_EncarregadoId",
                table: "SolicitacoesProducao",
                column: "EncarregadoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacoesProducao_ProdutoId",
                table: "SolicitacoesProducao",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacoesProducao_TipoOrdemDeProducaoId",
                table: "SolicitacoesProducao",
                column: "TipoOrdemDeProducaoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacoesProducao_UsuarioAprovacaoId",
                table: "SolicitacoesProducao",
                column: "UsuarioAprovacaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_PerfilId",
                table: "Usuarios",
                column: "PerfilId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FichaTecnicaItens");

            migrationBuilder.DropTable(
                name: "Fornecedores");

            migrationBuilder.DropTable(
                name: "LogsSistema");

            migrationBuilder.DropTable(
                name: "Movimentacoes");

            migrationBuilder.DropTable(
                name: "RoteiroProducaoEtapas");

            migrationBuilder.DropTable(
                name: "SolicitacaoProducaoItens");

            migrationBuilder.DropTable(
                name: "FichasTecnicas");

            migrationBuilder.DropTable(
                name: "OrdensDeProducao");

            migrationBuilder.DropTable(
                name: "FasesProducao");

            migrationBuilder.DropTable(
                name: "Lotes");

            migrationBuilder.DropTable(
                name: "RoteirosProducao");

            migrationBuilder.DropTable(
                name: "SolicitacoesProducao");

            migrationBuilder.DropTable(
                name: "Almoxarifados");

            migrationBuilder.DropTable(
                name: "Produtos");

            migrationBuilder.DropTable(
                name: "TiposDeOrdemDeProducao");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "CategoriasProduto");

            migrationBuilder.DropTable(
                name: "UnidadesMedida");

            migrationBuilder.DropTable(
                name: "Perfis");
        }
    }
}
