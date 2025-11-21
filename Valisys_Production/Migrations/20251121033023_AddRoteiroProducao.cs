using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Valisys_Production.Migrations
{
    /// <inheritdoc />
    public partial class AddRoteiroProducao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Descricao",
                table: "FasesProducao",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<bool>(
                name: "Ativo",
                table: "FasesProducao",
                type: "boolean",
                nullable: false,
                defaultValue: false);

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

            migrationBuilder.UpdateData(
                table: "FasesProducao",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000004"),
                column: "Ativo",
                value: true);

            migrationBuilder.UpdateData(
                table: "FasesProducao",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000013"),
                column: "Ativo",
                value: true);

            migrationBuilder.UpdateData(
                table: "FasesProducao",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000014"),
                column: "Ativo",
                value: true);

            migrationBuilder.UpdateData(
                table: "FasesProducao",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000015"),
                column: "Ativo",
                value: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoteiroProducaoEtapas");

            migrationBuilder.DropTable(
                name: "RoteirosProducao");

            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "FasesProducao");

            migrationBuilder.AlterColumn<string>(
                name: "Descricao",
                table: "FasesProducao",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);
        }
    }
}
