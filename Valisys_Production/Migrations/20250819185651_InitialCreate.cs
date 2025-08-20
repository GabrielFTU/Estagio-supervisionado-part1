using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Valisys_Production.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "Codigo_Barras",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "codigo_interno_Produto",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "DataCadastro",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "DataFim",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "FornecedorId",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "Quantidade",
                table: "Lotes");

            migrationBuilder.RenameColumn(
                name: "Unidade_Medida",
                table: "Produtos",
                newName: "CodigoInternoProduto");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Lotes",
                newName: "statusLote");

            migrationBuilder.RenameColumn(
                name: "DataInicio",
                table: "Lotes",
                newName: "DataAbertura");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Almoxarifados",
                newName: "Email");

            migrationBuilder.AddColumn<int>(
                name: "CategoriaProdutoId",
                table: "Produtos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "ControlarPorLote",
                table: "Produtos",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UnidadeMedidaId",
                table: "Produtos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CodigoLote",
                table: "Lotes",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataConclusao",
                table: "Lotes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Descricao",
                table: "Lotes",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Contato",
                table: "Almoxarifados",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(15)",
                oldMaxLength: 15);

            migrationBuilder.CreateTable(
                name: "CategoriaProdutos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriaProdutos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FaseProducoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Ordem = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FaseProducoes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Perfils",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Perfils", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tipoOrdemDeProducaos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tipoOrdemDeProducaos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UnidadeMedidas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnidadeMedidas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SenhaHash = table.Column<string>(type: "text", nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    PerfilId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuarios_Perfils_PerfilId",
                        column: x => x.PerfilId,
                        principalTable: "Perfils",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrdemDeProducoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CodigoOrdem = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DataInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataFim = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ProdutoId = table.Column<int>(type: "integer", nullable: false),
                    AlmoxarifadoId = table.Column<int>(type: "integer", nullable: false),
                    FaseAtualId = table.Column<int>(type: "integer", nullable: false),
                    LoteId = table.Column<int>(type: "integer", nullable: true),
                    TipoOrdemDeProducaoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdemDeProducoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrdemDeProducoes_Almoxarifados_AlmoxarifadoId",
                        column: x => x.AlmoxarifadoId,
                        principalTable: "Almoxarifados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdemDeProducoes_FaseProducoes_FaseAtualId",
                        column: x => x.FaseAtualId,
                        principalTable: "FaseProducoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdemDeProducoes_Lotes_LoteId",
                        column: x => x.LoteId,
                        principalTable: "Lotes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OrdemDeProducoes_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdemDeProducoes_tipoOrdemDeProducaos_TipoOrdemDeProducaoId",
                        column: x => x.TipoOrdemDeProducaoId,
                        principalTable: "tipoOrdemDeProducaos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Movimentacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DataMovimentacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    OrdemDeProducaoId = table.Column<int>(type: "integer", nullable: false),
                    AlmoxarifadoOrigemId = table.Column<int>(type: "integer", nullable: false),
                    AlmoxarifadoDestinoId = table.Column<int>(type: "integer", nullable: false),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movimentacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Movimentacoes_Almoxarifados_AlmoxarifadoDestinoId",
                        column: x => x.AlmoxarifadoDestinoId,
                        principalTable: "Almoxarifados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Movimentacoes_Almoxarifados_AlmoxarifadoOrigemId",
                        column: x => x.AlmoxarifadoOrigemId,
                        principalTable: "Almoxarifados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Movimentacoes_OrdemDeProducoes_OrdemDeProducaoId",
                        column: x => x.OrdemDeProducaoId,
                        principalTable: "OrdemDeProducoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Movimentacoes_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SolicitacaoProducaos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DataSolicitacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    EncarregadoId = table.Column<int>(type: "integer", nullable: false),
                    ProdutoId = table.Column<int>(type: "integer", nullable: false),
                    OrdemDeProducaoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitacaoProducaos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolicitacaoProducaos_OrdemDeProducoes_OrdemDeProducaoId",
                        column: x => x.OrdemDeProducaoId,
                        principalTable: "OrdemDeProducoes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SolicitacaoProducaos_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitacaoProducaos_Usuarios_EncarregadoId",
                        column: x => x.EncarregadoId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Produtos_CategoriaProdutoId",
                table: "Produtos",
                column: "CategoriaProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_Produtos_UnidadeMedidaId",
                table: "Produtos",
                column: "UnidadeMedidaId");

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
                name: "IX_Movimentacoes_UsuarioId",
                table: "Movimentacoes",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdemDeProducoes_AlmoxarifadoId",
                table: "OrdemDeProducoes",
                column: "AlmoxarifadoId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdemDeProducoes_FaseAtualId",
                table: "OrdemDeProducoes",
                column: "FaseAtualId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdemDeProducoes_LoteId",
                table: "OrdemDeProducoes",
                column: "LoteId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdemDeProducoes_ProdutoId",
                table: "OrdemDeProducoes",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdemDeProducoes_TipoOrdemDeProducaoId",
                table: "OrdemDeProducoes",
                column: "TipoOrdemDeProducaoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacaoProducaos_EncarregadoId",
                table: "SolicitacaoProducaos",
                column: "EncarregadoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacaoProducaos_OrdemDeProducaoId",
                table: "SolicitacaoProducaos",
                column: "OrdemDeProducaoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacaoProducaos_ProdutoId",
                table: "SolicitacaoProducaos",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_PerfilId",
                table: "Usuarios",
                column: "PerfilId");

            migrationBuilder.AddForeignKey(
                name: "FK_Produtos_CategoriaProdutos_CategoriaProdutoId",
                table: "Produtos",
                column: "CategoriaProdutoId",
                principalTable: "CategoriaProdutos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Produtos_UnidadeMedidas_UnidadeMedidaId",
                table: "Produtos",
                column: "UnidadeMedidaId",
                principalTable: "UnidadeMedidas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Produtos_CategoriaProdutos_CategoriaProdutoId",
                table: "Produtos");

            migrationBuilder.DropForeignKey(
                name: "FK_Produtos_UnidadeMedidas_UnidadeMedidaId",
                table: "Produtos");

            migrationBuilder.DropTable(
                name: "CategoriaProdutos");

            migrationBuilder.DropTable(
                name: "Movimentacoes");

            migrationBuilder.DropTable(
                name: "SolicitacaoProducaos");

            migrationBuilder.DropTable(
                name: "UnidadeMedidas");

            migrationBuilder.DropTable(
                name: "OrdemDeProducoes");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "FaseProducoes");

            migrationBuilder.DropTable(
                name: "tipoOrdemDeProducaos");

            migrationBuilder.DropTable(
                name: "Perfils");

            migrationBuilder.DropIndex(
                name: "IX_Produtos_CategoriaProdutoId",
                table: "Produtos");

            migrationBuilder.DropIndex(
                name: "IX_Produtos_UnidadeMedidaId",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "CategoriaProdutoId",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "ControlarPorLote",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "UnidadeMedidaId",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "CodigoLote",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "DataConclusao",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "Descricao",
                table: "Lotes");

            migrationBuilder.RenameColumn(
                name: "CodigoInternoProduto",
                table: "Produtos",
                newName: "Unidade_Medida");

            migrationBuilder.RenameColumn(
                name: "statusLote",
                table: "Lotes",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "DataAbertura",
                table: "Lotes",
                newName: "DataInicio");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Almoxarifados",
                newName: "email");

            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Produtos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Codigo_Barras",
                table: "Produtos",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "codigo_interno_Produto",
                table: "Produtos",
                type: "integer",
                maxLength: 50,
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "Ativo",
                table: "Lotes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataCadastro",
                table: "Lotes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DataFim",
                table: "Lotes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "FornecedorId",
                table: "Lotes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Quantidade",
                table: "Lotes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Contato",
                table: "Almoxarifados",
                type: "character varying(15)",
                maxLength: 15,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);
        }
    }
}
