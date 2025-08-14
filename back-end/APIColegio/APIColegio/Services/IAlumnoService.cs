using APIColegio.DTOs;

namespace APIColegio.Services
{
    public interface IAlumnoService
    {
        /// <summary>
        /// Crear un nuevo alumno
        /// </summary>
        /// <param name="alumnoDto">Datos del alumno a crear</param>
        /// <returns>Alumno creado</returns>
        Task<AlumnoResponseDto> CreateAlumnoAsync(AlumnoCreateDto alumnoDto);
        
        /// <summary>
        /// Obtener todos los alumnos con ordenamiento
        /// </summary>
        /// <param name="orderBy">Campo de ordenamiento: id, nombre, grado</param>
        /// <returns>Lista de todos los alumnos</returns>
        Task<IEnumerable<AlumnoResponseDto>> GetAllAlumnosAsync(string orderBy = "id");
        
        /// <summary>
        /// Obtener alumnos por grado
        /// </summary>
        /// <param name="grado">Grado a consultar</param>
        /// <returns>Lista de alumnos del grado especificado</returns>
        Task<IEnumerable<AlumnoResponseDto>> GetAlumnosByGradoAsync(string grado);
        
        /// <summary>
        /// Obtener un alumno por ID
        /// </summary>
        /// <param name="id">ID del alumno</param>
        /// <returns>Alumno encontrado o null</returns>
        Task<AlumnoResponseDto?> GetAlumnoByIdAsync(int id);
    }
}