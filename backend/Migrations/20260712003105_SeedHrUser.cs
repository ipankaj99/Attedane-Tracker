using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedHrUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CasualLeave", "EarnedLeave", "Email", "ManagerId", "Name", "PasswordHash", "Role", "SickLeave" },
                values: new object[] { 1, 5.0, 5.0, "hr@company.com", null, "HR Admin", "$2a$11$s3ErBF6fshWyTeKu2G.IKuDLFReS8YCx1OlaE4cronbbnBblvgGBe", "HR", 10.0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
