using APIColegio.DTOs;
using APIColegio.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIColegio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlumnosController : ControllerBase
    {
        private readonly IAlumnoService _alumnoService;
        private readonly ILogger<AlumnosController> _logger;

        public AlumnosController(IAlumnoService alumnoService, ILogger<AlumnosController> logger)
        {
            _alumnoService = alumnoService;
            _logger = logger;
        }

        /// <summary>
        /// Obtener todos los alumnos
        /// </summary>
        /// <returns>Lista de todos los alumnos</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AlumnoResponseDto>>> GetAllAlumnos()
        {
            try
            {
                var result = await _alumnoService.GetAllAlumnosAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todos los alumnos");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener alumnos por grado
        /// </summary>
        /// <param name="grado">Grado a consultar</param>
        /// <returns>Lista de alumnos del grado especificado</returns>
        [HttpGet("grado/{grado}")]
        public async Task<ActionResult<IEnumerable<AlumnoResponseDto>>> GetAlumnosByGrado(string grado)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(grado))
                {
                    return BadRequest(new { message = "El grado es requerido" });
                }

                var result = await _alumnoService.GetAlumnosByGradoAsync(grado);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener alumnos del grado: {Grado}", grado);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener un alumno por ID
        /// </summary>
        /// <param name="id">ID del alumno</param>
        /// <returns>Alumno encontrado</returns>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AlumnoResponseDto>> GetAlumnoById(int id)
        {
            try
            {
                var result = await _alumnoService.GetAlumnoByIdAsync(id);
                
                if (result == null)
                {
                    return NotFound(new { message = $"No se encontró alumno con ID: {id}" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener alumno con ID: {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Crear un nuevo alumno
        /// </summary>
        /// <param name="alumnoDto">Datos del alumno a crear</param>
        /// <returns>Alumno creado</returns>
        [HttpPost]
        public async Task<ActionResult<AlumnoResponseDto>> CreateAlumno([FromBody] AlumnoCreateDto alumnoDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _alumnoService.CreateAlumnoAsync(alumnoDto);
                
                return CreatedAtAction(
                    nameof(GetAlumnoById), 
                    new { id = result.Id }, 
                    result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear alumno: {NombreAlumno}", alumnoDto.NombreAlumno);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }
}