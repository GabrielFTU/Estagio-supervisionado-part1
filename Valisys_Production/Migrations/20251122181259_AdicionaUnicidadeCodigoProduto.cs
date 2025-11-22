using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Valisys_Production.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaUnicidadeCodigoProduto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000010"));

            migrationBuilder.DeleteData(
                table: "Perfis",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000011"));

            migrationBuilder.CreateIndex(
                name: "IX_Produtos_CodigoInternoProduto",
                table: "Produtos",
                column: "CodigoInternoProduto",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Produtos_CodigoInternoProduto",
                table: "Produtos");

            migrationBuilder.InsertData(
                table: "Perfis",
                columns: new[] { "Id", "Ativo", "Nome" },
                values: new object[,]
                {
                    { new Guid("c0de0000-0000-0000-0000-000000000010"), true, "Gerente PCP" },
                    { new Guid("c0de0000-0000-0000-0000-000000000011"), true, "Encarregado Producao" }
                });
        }
    }
}
