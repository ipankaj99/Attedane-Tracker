using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovedByToLeaveRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApprovedBy",
                table: "LeaveRequests",
                type: "INTEGER",
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LeaveRequests_Users_ApproverId",
                table: "LeaveRequests");

            migrationBuilder.DropIndex(
                name: "IX_LeaveRequests_ApproverId",
                table: "LeaveRequests");

            migrationBuilder.DropColumn(
                name: "ApprovedBy",
                table: "LeaveRequests");

            migrationBuilder.DropColumn(
                name: "ApproverId",
                table: "LeaveRequests");
        }
    }
}
