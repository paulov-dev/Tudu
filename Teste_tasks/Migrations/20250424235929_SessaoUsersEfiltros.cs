using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Teste_tasks.Migrations
{
    /// <inheritdoc />
    public partial class SessaoUsersEfiltros : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "TarefaModel",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_TarefaModel_UserId",
                table: "TarefaModel",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TarefaModel_AspNetUsers_UserId",
                table: "TarefaModel",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TarefaModel_AspNetUsers_UserId",
                table: "TarefaModel");

            migrationBuilder.DropIndex(
                name: "IX_TarefaModel_UserId",
                table: "TarefaModel");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TarefaModel");
        }
    }
}
