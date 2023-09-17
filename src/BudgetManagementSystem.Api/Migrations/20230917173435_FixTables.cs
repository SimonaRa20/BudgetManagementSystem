using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetManagementSystem.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InvitationDto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsAccepted = table.Column<bool>(type: "bit", nullable: false),
                    FamilyId = table.Column<int>(type: "int", nullable: true),
                    InvitedUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvitationDto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvitationDto_Families_FamilyId",
                        column: x => x.FamilyId,
                        principalTable: "Families",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_InvitationDto_Users_InvitedUserId",
                        column: x => x.InvitedUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvitationDto_FamilyId",
                table: "InvitationDto",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_InvitationDto_InvitedUserId",
                table: "InvitationDto",
                column: "InvitedUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvitationDto");
        }
    }
}
