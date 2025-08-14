namespace APIColegio.DTOs
{
    public class AlumnoResponseDto
    {
        public int Id { get; set; }
        public string NombreAlumno { get; set; } = string.Empty;
        public DateTime FechaNacimiento { get; set; }
        public string NombrePadre { get; set; } = string.Empty;
        public string NombreMadre { get; set; } = string.Empty;
        public string Grado { get; set; } = string.Empty;
        public string Seccion { get; set; } = string.Empty;
        public DateTime FechaIngreso { get; set; }
        
        // Propiedades calculadas adicionales
        public int Edad => DateTime.Now.Year - FechaNacimiento.Year - 
            (DateTime.Now.DayOfYear < FechaNacimiento.DayOfYear ? 1 : 0);
        
        public string GradoCompleto => $"{Grado} {Seccion}";
    }
}