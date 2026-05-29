using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "pii_export_log",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AdminId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ReportType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    FiltersSerialized = table.Column<string>(type: "text", nullable: false),
                    ExportTimestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IncludesFullPii = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pii_export_log", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "scheduled_reports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AdminId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ReportType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    FiltersSerialized = table.Column<string>(type: "text", nullable: false),
                    Frequency = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: true),
                    DayOfMonth = table.Column<int>(type: "integer", nullable: true),
                    DeliveryTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    RecipientEmailsSerialized = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_scheduled_reports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "visits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    VisitorName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Company = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    HostEmployee = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Department = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IdTypeMasked = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CheckInDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CheckInTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    CheckOutTime = table.Column<TimeSpan>(type: "interval", nullable: true),
                    TotalDuration = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    VisitPurpose = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_visits", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_pii_export_log_AdminId",
                table: "pii_export_log",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_pii_export_log_ExportTimestamp",
                table: "pii_export_log",
                column: "ExportTimestamp");

            migrationBuilder.CreateIndex(
                name: "IX_scheduled_reports_AdminId",
                table: "scheduled_reports",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_scheduled_reports_IsActive",
                table: "scheduled_reports",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_visits_CheckInDate",
                table: "visits",
                column: "CheckInDate");

            migrationBuilder.CreateIndex(
                name: "IX_visits_Department",
                table: "visits",
                column: "Department");

            migrationBuilder.CreateIndex(
                name: "IX_visits_HostEmployee",
                table: "visits",
                column: "HostEmployee");

            migrationBuilder.CreateIndex(
                name: "IX_visits_Status",
                table: "visits",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "pii_export_log");

            migrationBuilder.DropTable(
                name: "scheduled_reports");

            migrationBuilder.DropTable(
                name: "visits");
        }
    }
}
