using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Teste_tasks.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusPrioridadeV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Prioridade",
                table: "TarefaModel",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StatusTarefa",
                table: "TarefaModel",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Prioridade",
                table: "TarefaModel");

            migrationBuilder.DropColumn(
                name: "StatusTarefa",
                table: "TarefaModel");
        }
    }
}
