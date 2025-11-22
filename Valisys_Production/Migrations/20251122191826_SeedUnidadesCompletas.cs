using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Valisys_Production.Migrations
{
    /// <inheritdoc />
    public partial class SeedUnidadesCompletas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EhUnidadeBase",
                table: "UnidadesMedida",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "FatorConversao",
                table: "UnidadesMedida",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Grandeza",
                table: "UnidadesMedida",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "CategoriasProduto",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000006"),
                column: "Nome",
                value: "Veículos Pesados");

            migrationBuilder.UpdateData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000002"),
                columns: new[] { "EhUnidadeBase", "FatorConversao", "Grandeza" },
                values: new object[] { true, 1m, 0 });

            migrationBuilder.UpdateData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000003"),
                columns: new[] { "EhUnidadeBase", "FatorConversao", "Grandeza" },
                values: new object[] { true, 1m, 1 });

            migrationBuilder.UpdateData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000012"),
                columns: new[] { "EhUnidadeBase", "FatorConversao", "Grandeza" },
                values: new object[] { true, 1m, 2 });

            migrationBuilder.InsertData(
                table: "UnidadesMedida",
                columns: new[] { "Id", "EhUnidadeBase", "FatorConversao", "Grandeza", "Nome", "Sigla" },
                values: new object[] { new Guid("c0de0000-0000-0000-0000-000000000099"), false, 0.001m, 1, "Grama", "G" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000099"));

            migrationBuilder.DropColumn(
                name: "EhUnidadeBase",
                table: "UnidadesMedida");

            migrationBuilder.DropColumn(
                name: "FatorConversao",
                table: "UnidadesMedida");

            migrationBuilder.DropColumn(
                name: "Grandeza",
                table: "UnidadesMedida");

            migrationBuilder.UpdateData(
                table: "CategoriasProduto",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000006"),
                column: "Nome",
                value: "Produto Generico");
        }
    }
}
