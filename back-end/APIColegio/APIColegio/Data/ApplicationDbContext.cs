using APIColegio.Models;
using Microsoft.EntityFrameworkCore;

namespace APIColegio.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Alumno> Alumnos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de la entidad Alumno
            modelBuilder.Entity<Alumno>(entity =>
            {
                entity.ToTable("alumnos");
                
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.NombreAlumno)
                    .HasColumnName("nombre_alumno")
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.FechaNacimiento)
                    .HasColumnName("fecha_nacimiento")
                    .HasColumnType("date")  // Usar date en lugar de timestamp
                    .IsRequired();

                entity.Property(e => e.NombrePadre)
                    .HasColumnName("nombre_padre")
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.NombreMadre)
                    .HasColumnName("nombre_madre")
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Grado)
                    .HasColumnName("grado")
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Seccion)
                    .HasColumnName("seccion")
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.FechaIngreso)
                    .HasColumnName("fecha_ingreso")
                    .HasColumnType("date")  // Usar date en lugar de timestamp
                    .IsRequired();

                // Índices para optimizar consultas por grado
                entity.HasIndex(e => e.Grado)
                    .HasDatabaseName("idx_alumnos_grado");

                entity.HasIndex(e => e.Seccion)
                    .HasDatabaseName("idx_alumnos_seccion");
            });

            // Datos de prueba con DateTime.SpecifyKind para UTC
            modelBuilder.Entity<Alumno>().HasData(
                new Alumno
                {
                    Id = 1,
                    NombreAlumno = "Juan Pérez García",
                    FechaNacimiento = new DateTime(2010, 5, 15),
                    NombrePadre = "Carlos Pérez López",
                    NombreMadre = "María García Hernández",
                    Grado = "5to",
                    Seccion = "A",
                    FechaIngreso = new DateTime(2021, 2, 1)
                },
                new Alumno
                {
                    Id = 2,
                    NombreAlumno = "Ana López Martínez",
                    FechaNacimiento = new DateTime(2009, 8, 22),
                    NombrePadre = "Roberto López Silva",
                    NombreMadre = "Carmen Martínez Rodríguez",
                    Grado = "6to",
                    Seccion = "B",
                    FechaIngreso = new DateTime(2020, 2, 1)
                },
                new Alumno
                {
                    Id = 3,
                    NombreAlumno = "Luis Fernández Ruiz",
                    FechaNacimiento = new DateTime(2011, 3, 10),
                    NombrePadre = "José Fernández Castro",
                    NombreMadre = "Laura Ruiz Morales",
                    Grado = "4to",
                    Seccion = "A",
                    FechaIngreso = new DateTime(2022, 2, 1)
                }
            );
        }
    }
}