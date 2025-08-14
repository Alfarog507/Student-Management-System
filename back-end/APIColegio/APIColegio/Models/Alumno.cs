using System.ComponentModel.DataAnnotations;

namespace APIColegio.Models
{
    public class Alumno
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string NombreAlumno { get; set; } = string.Empty;

        [Required]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        [StringLength(100)]
        public string NombrePadre { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string NombreMadre { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Grado { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        public string Seccion { get; set; } = string.Empty;

        [Required]
        public DateTime FechaIngreso { get; set; }
    }
}
