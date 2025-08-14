using APIColegio.Data;
using APIColegio.DTOs;
using APIColegio.Models;
using Microsoft.EntityFrameworkCore;

namespace APIColegio.Services
{
    public class AlumnoService : IAlumnoService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AlumnoService> _logger;

        public AlumnoService(ApplicationDbContext context, ILogger<AlumnoService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<AlumnoResponseDto> CreateAlumnoAsync(AlumnoCreateDto alumnoDto)
        {
            try
            {
                _logger.LogInformation("Creando nuevo alumno: {NombreAlumno}", alumnoDto.NombreAlumno);

                var alumno = new Alumno
                {
                    NombreAlumno = alumnoDto.NombreAlumno,
                    FechaNacimiento = alumnoDto.FechaNacimiento,
                    NombrePadre = alumnoDto.NombrePadre,
                    NombreMadre = alumnoDto.NombreMadre,
                    Grado = alumnoDto.Grado,
                    Seccion = alumnoDto.Seccion,
                    FechaIngreso = alumnoDto.FechaIngreso
                };

                _context.Alumnos.Add(alumno);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Alumno creado exitosamente con ID: {Id}", alumno.Id);

                return MapToResponseDto(alumno);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear alumno: {NombreAlumno}", alumnoDto.NombreAlumno);
                throw;
            }
        }

        public async Task<IEnumerable<AlumnoResponseDto>> GetAllAlumnosAsync(string orderBy = "id")
        {
            try
            {
                _logger.LogInformation("Obteniendo todos los alumnos con ordenamiento: {OrderBy}", orderBy);

                var query = _context.Alumnos.AsQueryable();

                // Aplicar ordenamiento según el parámetro
                query = orderBy.ToLower() switch
                {
                    "id" => query.OrderBy(a => a.Id),
                    "nombre" => query.OrderBy(a => a.NombreAlumno),
                    "grado" => query.OrderBy(a => a.Grado).ThenBy(a => a.Seccion).ThenBy(a => a.NombreAlumno),
                    _ => throw new ArgumentException($"Campo de ordenamiento no válido: {orderBy}. Valores permitidos: id, nombre, grado")
                };

                var alumnos = await query.ToListAsync();

                _logger.LogInformation("Se encontraron {Count} alumnos", alumnos.Count);

                return alumnos.Select(MapToResponseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todos los alumnos");
                throw;
            }
        }

        public async Task<IEnumerable<AlumnoResponseDto>> GetAlumnosByGradoAsync(string grado)
        {
            try
            {
                _logger.LogInformation("Obteniendo alumnos del grado: {Grado}", grado);

                var alumnos = await _context.Alumnos
                    .Where(a => a.Grado.ToLower() == grado.ToLower())
                    .OrderBy(a => a.Seccion)
                    .ThenBy(a => a.NombreAlumno)
                    .ToListAsync();

                _logger.LogInformation("Se encontraron {Count} alumnos en el grado {Grado}", alumnos.Count, grado);

                return alumnos.Select(MapToResponseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener alumnos del grado: {Grado}", grado);
                throw;
            }
        }

        public async Task<AlumnoResponseDto?> GetAlumnoByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation("Obteniendo alumno con ID: {Id}", id);

                var alumno = await _context.Alumnos
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (alumno == null)
                {
                    _logger.LogWarning("No se encontró alumno con ID: {Id}", id);
                    return null;
                }

                return MapToResponseDto(alumno);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener alumno con ID: {Id}", id);
                throw;
            }
        }

        private static AlumnoResponseDto MapToResponseDto(Alumno alumno)
        {
            return new AlumnoResponseDto
            {
                Id = alumno.Id,
                NombreAlumno = alumno.NombreAlumno,
                FechaNacimiento = alumno.FechaNacimiento,
                NombrePadre = alumno.NombrePadre,
                NombreMadre = alumno.NombreMadre,
                Grado = alumno.Grado,
                Seccion = alumno.Seccion,
                FechaIngreso = alumno.FechaIngreso
            };
        }
    }
}