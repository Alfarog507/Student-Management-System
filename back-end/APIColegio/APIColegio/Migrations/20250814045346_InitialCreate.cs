using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace APIColegio.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "alumnos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre_alumno = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    fecha_nacimiento = table.Column<DateTime>(type: "date", nullable: false),
                    nombre_padre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    nombre_madre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    grado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    seccion = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    fecha_ingreso = table.Column<DateTime>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alumnos", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "alumnos",
                columns: new[] { "id", "fecha_ingreso", "fecha_nacimiento", "grado", "nombre_alumno", "nombre_madre", "nombre_padre", "seccion" },
                values: new object[,]
                {
                    { 1, new DateTime(2021, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2010, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "5to", "Juan Pérez García", "María García Hernández", "Carlos Pérez López", "A" },
                    { 2, new DateTime(2020, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2009, 8, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "6to", "Ana López Martínez", "Carmen Martínez Rodríguez", "Roberto López Silva", "B" },
                    { 3, new DateTime(2022, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2011, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "4to", "Luis Fernández Ruiz", "Laura Ruiz Morales", "José Fernández Castro", "A" }
                });

            migrationBuilder.CreateIndex(
                name: "idx_alumnos_grado",
                table: "alumnos",
                column: "grado");

            migrationBuilder.CreateIndex(
                name: "idx_alumnos_seccion",
                table: "alumnos",
                column: "seccion");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "alumnos");
        }
    }
}
