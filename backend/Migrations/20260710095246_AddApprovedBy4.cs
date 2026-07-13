using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovedBy4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LeaveRequests_Users_ApproverId",
                table: "LeaveRequests");

            migrationBuilder.DropIndex(
                name: "IX_LeaveRequests_ApproverId",
                table: "LeaveRequests");

            migrationBuilder.DropColumn(
                name: "ApproverId",
                table: "LeaveRequests");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequests_ApprovedBy",
                table: "LeaveRequests",
                column: "ApprovedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_LeaveRequests_Users_ApprovedBy",
                table: "LeaveRequests",
                column: "ApprovedBy",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LeaveRequests_Users_ApprovedBy",
                table: "LeaveRequests");

            migrationBuilder.DropIndex(
                name: "IX_LeaveRequests_ApprovedBy",
                table: "LeaveRequests");

            migrationBuilder.AddColumn<int>(
                name: "ApproverId",
                table: "LeaveRequests",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequests_ApproverId",
                table: "LeaveRequests",
                column: "ApproverId");

            migrationBuilder.AddForeignKey(
                name: "FK_LeaveRequests_Users_ApproverId",
                table: "LeaveRequests",
                column: "ApproverId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
