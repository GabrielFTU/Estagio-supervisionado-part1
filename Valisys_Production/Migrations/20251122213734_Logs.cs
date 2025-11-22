using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Valisys_Production.Migrations
{
    /// <inheritdoc />
    public partial class Logs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.InsertData(
                table: "UnidadesMedida",
                columns: new[] { "Id", "EhUnidadeBase", "FatorConversao", "Grandeza", "Nome", "Sigla" },
                values: new object[,]
                {
                    { new Guid("c0de0000-0000-0000-0000-000000000020"), false, 1m, 0, "Peça", "PC" },
                    { new Guid("c0de0000-0000-0000-0000-000000000021"), false, 1m, 0, "Caixa", "CX" },
                    { new Guid("c0de0000-0000-0000-0000-000000000022"), false, 1m, 0, "Kit", "KIT" },
                    { new Guid("c0de0000-0000-0000-0000-000000000023"), false, 12m, 0, "Dúzia", "DZ" },
                    { new Guid("c0de0000-0000-0000-0000-000000000024"), false, 1000m, 0, "Milheiro", "MIL" },
                    { new Guid("c0de0000-0000-0000-0000-000000000031"), false, 0.000001m, 1, "Miligrama", "MG" },
                    { new Guid("c0de0000-0000-0000-0000-000000000032"), false, 1000m, 1, "Tonelada", "TON" },
                    { new Guid("c0de0000-0000-0000-0000-000000000040"), false, 0.01m, 2, "Centímetro", "CM" },
                    { new Guid("c0de0000-0000-0000-0000-000000000041"), false, 0.001m, 2, "Milímetro", "MM" },
                    { new Guid("c0de0000-0000-0000-0000-000000000042"), false, 1000m, 2, "Quilômetro", "KM" },
                    { new Guid("c0de0000-0000-0000-0000-000000000050"), true, 1m, 3, "Litro", "L" },
                    { new Guid("c0de0000-0000-0000-0000-000000000051"), false, 0.001m, 3, "Mililitro", "ML" },
                    { new Guid("c0de0000-0000-0000-0000-000000000052"), false, 1000m, 3, "Metro Cúbico", "M3" },
                    { new Guid("c0de0000-0000-0000-0000-000000000060"), true, 1m, 5, "Metro Quadrado", "M2" },
                    { new Guid("c0de0000-0000-0000-0000-000000000061"), false, 0.0001m, 5, "Centímetro Quadrado", "CM2" },
                    { new Guid("c0de0000-0000-0000-0000-000000000070"), true, 1m, 4, "Hora", "H" },
                    { new Guid("c0de0000-0000-0000-0000-000000000071"), false, 0.0166667m, 4, "Minuto", "MIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_LogsSistema_UsuarioId",
                table: "LogsSistema",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LogsSistema");

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000020"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000021"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000022"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000023"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000024"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000031"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000032"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000040"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000041"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000042"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000050"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000051"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000052"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000060"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000061"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000070"));

            migrationBuilder.DeleteData(
                table: "UnidadesMedida",
                keyColumn: "Id",
                keyValue: new Guid("c0de0000-0000-0000-0000-000000000071"));
        }
    }
}
