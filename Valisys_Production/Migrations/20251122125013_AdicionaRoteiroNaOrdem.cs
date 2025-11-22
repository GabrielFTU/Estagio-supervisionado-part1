using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Valisys_Production.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaRoteiroNaOrdem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RoteiroProducaoId",
                table: "OrdensDeProducao",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeProducao_RoteiroProducaoId",
                table: "OrdensDeProducao",
                column: "RoteiroProducaoId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrdensDeProducao_RoteirosProducao_RoteiroProducaoId",
                table: "OrdensDeProducao",
                column: "RoteiroProducaoId",
                principalTable: "RoteirosProducao",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrdensDeProducao_RoteirosProducao_RoteiroProducaoId",
                table: "OrdensDeProducao");

            migrationBuilder.DropIndex(
                name: "IX_OrdensDeProducao_RoteiroProducaoId",
                table: "OrdensDeProducao");

            migrationBuilder.DropColumn(
                name: "RoteiroProducaoId",
                table: "OrdensDeProducao");
        }
    }
}
