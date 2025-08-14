using System.ComponentModel.DataAnnotations;

namespace APIColegio.DTOs
{
    public class AlumnoCreateDto
    {
        [Required(ErrorMessage = "El nombre del alumno es obligatorio")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres")]
        public string NombreAlumno { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria")]
        public DateTime FechaNacimiento { get; set; }
        
        [Required(ErrorMessage = "El nombre del padre es obligatorio")]
        [StringLength(100, ErrorMessage = "El nombre del padre no puede exceder 100 caracteres")]
        public string NombrePadre { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El nombre de la madre es obligatorio")]
        [StringLength(100, ErrorMessage = "El nombre de la madre no puede exceder 100 caracteres")]
        public string NombreMadre { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El grado es obligatorio")]
        [StringLength(20, ErrorMessage = "El grado no puede exceder 20 caracteres")]
        public string Grado { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "La sección es obligatoria")]
        [StringLength(10, ErrorMessage = "La sección no puede exceder 10 caracteres")]
        public string Seccion { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "La fecha de ingreso es obligatoria")]
        public DateTime FechaIngreso { get; set; }
    }
}