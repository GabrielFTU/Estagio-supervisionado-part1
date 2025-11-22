using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Valisys_Production.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaUnicidadeCategoria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Codigo",
                table: "CategoriasProduto",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "CategoriasProduto",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000006"),
                columns: new[] { "Codigo", "Nome" },
                values: new object[] { "CAT-001", "Produto Generico" });

            migrationBuilder.CreateIndex(
                name: "IX_CategoriasProduto_Codigo",
                table: "CategoriasProduto",
                column: "Codigo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CategoriasProduto_Codigo",
                table: "CategoriasProduto");

            migrationBuilder.DropColumn(
                name: "Codigo",
                table: "CategoriasProduto");

            migrationBuilder.UpdateData(
                table: "CategoriasProduto",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000006"),
                column: "Nome",
                value: "Veículos Pesados");
        }
    }
}
