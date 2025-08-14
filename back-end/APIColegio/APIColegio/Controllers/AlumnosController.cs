using APIColegio.DTOs;
using APIColegio.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIColegio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
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
        /// <param name="orderBy">Campo de ordenamiento: id, nombre, grado (default: id)</param>
        /// <returns>Lista de todos los alumnos con información adicional</returns>
        /// <response code="200">Lista de alumnos obtenida exitosamente</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<AlumnoResponseDto>>), 200)]
        [ProducesResponseType(typeof(ApiErrorResponse), 500)]
        public async Task<ActionResult<ApiResponse<IEnumerable<AlumnoResponseDto>>>> GetAllAlumnos(
            [FromQuery] string orderBy = "id")
        {
            try
            {
                var result = await _alumnoService.GetAllAlumnosAsync(orderBy);
                
                var response = new ApiResponse<IEnumerable<AlumnoResponseDto>>
                {
                    Success = true,
                    Data = result,
                    Message = "Alumnos obtenidos exitosamente",
                    Count = result.Count(),
                    Timestamp = DateTime.UtcNow
                };

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Parámetro de ordenamiento inválido: {OrderBy}", orderBy);
                return BadRequest(new ApiErrorResponse
                {
                    Success = false,
                    Message = ex.Message,
                    ErrorCode = "INVALID_ORDER_PARAMETER",
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todos los alumnos");
                return StatusCode(500, new ApiErrorResponse
                {
                    Success = false,
                    Message = "Error interno del servidor",
                    ErrorCode = "INTERNAL_SERVER_ERROR",
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Obtener alumnos por grado
        /// </summary>
        /// <param name="grado">Grado a consultar (ej: 5to, 6to)</param>
        /// <returns>Lista de alumnos del grado especificado</returns>
        /// <response code="200">Alumnos del grado obtenidos exitosamente</response>
        /// <response code="400">Grado inválido o no especificado</response>
        /// <response code="404">No se encontraron alumnos en el grado especificado</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpGet("grado/{grado}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<AlumnoResponseDto>>), 200)]
        [ProducesResponseType(typeof(ApiErrorResponse), 400)]
        [ProducesResponseType(typeof(ApiErrorResponse), 404)]
        [ProducesResponseType(typeof(ApiErrorResponse), 500)]
        public async Task<ActionResult<ApiResponse<IEnumerable<AlumnoResponseDto>>>> GetAlumnosByGrado(string grado)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(grado))
                {
                    return BadRequest(new ApiErrorResponse
                    {
                        Success = false,
                        Message = "El grado es requerido",
                        ErrorCode = "MISSING_GRADE_PARAMETER",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var result = await _alumnoService.GetAlumnosByGradoAsync(grado);
                
                if (!result.Any())
                {
                    return NotFound(new ApiErrorResponse
                    {
                        Success = false,
                        Message = $"No se encontraron alumnos en el grado: {grado}",
                        ErrorCode = "NO_STUDENTS_FOUND",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var response = new ApiResponse<IEnumerable<AlumnoResponseDto>>
                {
                    Success = true,
                    Data = result,
                    Message = $"Alumnos del grado {grado} obtenidos exitosamente",
                    Count = result.Count(),
                    Timestamp = DateTime.UtcNow
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener alumnos del grado: {Grado}", grado);
                return StatusCode(500, new ApiErrorResponse
                {
                    Success = false,
                    Message = "Error interno del servidor",
                    ErrorCode = "INTERNAL_SERVER_ERROR",
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Obtener un alumno por ID
        /// </summary>
        /// <param name="id">ID del alumno</param>
        /// <returns>Alumno encontrado</returns>
        /// <response code="200">Alumno encontrado exitosamente</response>
        /// <response code="400">ID inválido</response>
        /// <response code="404">Alumno no encontrado</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<AlumnoResponseDto>), 200)]
        [ProducesResponseType(typeof(ApiErrorResponse), 400)]
        [ProducesResponseType(typeof(ApiErrorResponse), 404)]
        [ProducesResponseType(typeof(ApiErrorResponse), 500)]
        public async Task<ActionResult<ApiResponse<AlumnoResponseDto>>> GetAlumnoById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new ApiErrorResponse
                    {
                        Success = false,
                        Message = "El ID debe ser un número positivo",
                        ErrorCode = "INVALID_ID",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var result = await _alumnoService.GetAlumnoByIdAsync(id);
                
                if (result == null)
                {
                    return NotFound(new ApiErrorResponse
                    {
                        Success = false,
                        Message = $"No se encontró alumno con ID: {id}",
                        ErrorCode = "STUDENT_NOT_FOUND",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var response = new ApiResponse<AlumnoResponseDto>
                {
                    Success = true,
                    Data = result,
                    Message = "Alumno obtenido exitosamente",
                    Timestamp = DateTime.UtcNow
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener alumno con ID: {Id}", id);
                return StatusCode(500, new ApiErrorResponse
                {
                    Success = false,
                    Message = "Error interno del servidor",
                    ErrorCode = "INTERNAL_SERVER_ERROR",
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Crear un nuevo alumno
        /// </summary>
        /// <param name="alumnoDto">Datos del alumno a crear</param>
        /// <returns>Alumno creado</returns>
        /// <response code="201">Alumno creado exitosamente</response>
        /// <response code="400">Datos de entrada inválidos</response>
        /// <response code="409">Conflicto - Alumno ya existe</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<AlumnoResponseDto>), 201)]
        [ProducesResponseType(typeof(ApiErrorResponse), 400)]
        [ProducesResponseType(typeof(ApiErrorResponse), 409)]
        [ProducesResponseType(typeof(ApiErrorResponse), 500)]
        public async Task<ActionResult<ApiResponse<AlumnoResponseDto>>> CreateAlumno([FromBody] AlumnoCreateDto alumnoDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .SelectMany(x => x.Value!.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToList();

                    return BadRequest(new ApiErrorResponse
                    {
                        Success = false,
                        Message = "Datos de entrada inválidos",
                        ErrorCode = "VALIDATION_ERROR",
                        Errors = errors,
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Validación de negocio: fechas lógicas
                if (alumnoDto.FechaNacimiento > DateTime.Now)
                {
                    return BadRequest(new ApiErrorResponse
                    {
                        Success = false,
                        Message = "La fecha de nacimiento no puede ser futura",
                        ErrorCode = "INVALID_BIRTH_DATE",
                        Timestamp = DateTime.UtcNow
                    });
                }

                if (alumnoDto.FechaIngreso < alumnoDto.FechaNacimiento)
                {
                    return BadRequest(new ApiErrorResponse
                    {
                        Success = false,
                        Message = "La fecha de ingreso no puede ser anterior a la fecha de nacimiento",
                        ErrorCode = "INVALID_ENROLLMENT_DATE",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var result = await _alumnoService.CreateAlumnoAsync(alumnoDto);
                
                var response = new ApiResponse<AlumnoResponseDto>
                {
                    Success = true,
                    Data = result,
                    Message = "Alumno creado exitosamente",
                    Timestamp = DateTime.UtcNow
                };

                return CreatedAtAction(
                    nameof(GetAlumnoById), 
                    new { id = result.Id }, 
                    response);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Conflicto al crear alumno: {NombreAlumno}", alumnoDto.NombreAlumno);
                return Conflict(new ApiErrorResponse
                {
                    Success = false,
                    Message = ex.Message,
                    ErrorCode = "STUDENT_ALREADY_EXISTS",
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear alumno: {NombreAlumno}", alumnoDto.NombreAlumno);
                return StatusCode(500, new ApiErrorResponse
                {
                    Success = false,
                    Message = "Error interno del servidor",
                    ErrorCode = "INTERNAL_SERVER_ERROR",
                    Timestamp = DateTime.UtcNow
                });
            }
        }
    }
}