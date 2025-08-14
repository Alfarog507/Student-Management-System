using APIColegio.DTOs;
using APIColegio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace APIColegio.Controllers
{
    /// <summary>
    /// Controlador para la gestión de alumnos del colegio
    /// </summary>
    /// <remarks>
    /// Este controlador proporciona endpoints para:
    /// - Crear nuevos alumnos
    /// - Consultar alumnos (todos, por ID, por grado)
    /// - Validar datos de entrada
    /// - Manejar respuestas estructuradas
    /// 
    /// **Requiere autenticación con API Key**
    /// </remarks>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [SwaggerTag("Gestión de alumnos del colegio")]
    public class AlumnosController : ControllerBase
    {
        private readonly IAlumnoService _alumnoService;
        private readonly ILogger<AlumnosController> _logger;

        /// <summary>
        /// Constructor del controlador de alumnos
        /// </summary>
        /// <param name="alumnoService">Servicio de gestión de alumnos</param>
        /// <param name="logger">Logger para el controlador</param>
        public AlumnosController(IAlumnoService alumnoService, ILogger<AlumnosController> logger)
        {
            _alumnoService = alumnoService;
            _logger = logger;
        }

        /// <summary>
        /// Obtener todos los alumnos
        /// </summary>
        /// <remarks>
        /// Obtiene una lista completa de todos los alumnos registrados en el sistema.
        /// 
        /// **Parámetros de ordenamiento disponibles:**
        /// - `id`: Ordenar por ID del alumno (por defecto)
        /// - `nombre`: Ordenar alfabéticamente por nombre
        /// - `grado`: Ordenar por grado, luego sección, luego nombre
        /// 
        /// **Ejemplo de uso:**
        /// ```
        /// GET /api/alumnos?orderBy=nombre
        /// X-API-Key: colegio-api-key-2024
        /// ```
        /// 
        /// **Respuesta exitosa:**
        /// ```json
        /// {
        ///   "success": true,
        ///   "data": [
        ///     {
        ///       "id": 1,
        ///       "nombreAlumno": "Juan Pérez",
        ///       "fechaNacimiento": "2010-05-15",
        ///       "nombrePadre": "Carlos Pérez",
        ///       "nombreMadre": "María García",
        ///       "grado": "5to",
        ///       "seccion": "A",
        ///       "fechaIngreso": "2021-02-01",
        ///       "edad": 13,
        ///       "gradoCompleto": "5to A"
        ///     }
        ///   ],
        ///   "message": "Alumnos obtenidos exitosamente",
        ///   "count": 1,
        ///   "timestamp": "2024-01-15T10:30:00Z"
        /// }
        /// ```
        /// </remarks>
        /// <param name="orderBy">Campo de ordenamiento: id, nombre, grado (default: id)</param>
        /// <returns>Lista de todos los alumnos con información adicional</returns>
        /// <response code="200">Lista de alumnos obtenida exitosamente</response>
        /// <response code="400">Parámetro de ordenamiento inválido</response>
        /// <response code="401">No autorizado - API Key requerida o inválida</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpGet]
        [SwaggerOperation(Summary = "Obtener todos los alumnos", Description = "Retorna una lista paginada de todos los alumnos con opciones de ordenamiento")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<AlumnoResponseDto>>), 200)]
        [ProducesResponseType(typeof(ApiErrorResponse), 400)]
        [ProducesResponseType(typeof(object), 401)]
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
        /// <remarks>
        /// Filtra y obtiene todos los alumnos que pertenecen a un grado específico.
        /// 
        /// **Grados válidos típicos:**
        /// - Preescolar: `kinder`, `pre-kinder`
        /// - Primaria: `1ro`, `2do`, `3ro`, `4to`, `5to`, `6to`
        /// - Secundaria: `7mo`, `8vo`, `9no`, `10mo`, `11vo`
        /// 
        /// **Ejemplo de uso:**
        /// ```
        /// GET /api/alumnos/grado/5to
        /// X-API-Key: colegio-api-key-2024
        /// ```
        /// 
        /// Los resultados se ordenan automáticamente por sección y luego por nombre del alumno.
        /// </remarks>
        /// <param name="grado">Grado a consultar (ej: 5to, 6to, 1ro)</param>
        /// <returns>Lista de alumnos del grado especificado</returns>
        /// <response code="200">Alumnos del grado obtenidos exitosamente</response>
        /// <response code="400">Grado inválido o no especificado</response>
        /// <response code="401">No autorizado - API Key requerida o inválida</response>
        /// <response code="404">No se encontraron alumnos en el grado especificado</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpGet("grado/{grado}")]
        [SwaggerOperation(Summary = "Obtener alumnos por grado", Description = "Filtra alumnos por grado específico")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<AlumnoResponseDto>>), 200)]
        [ProducesResponseType(typeof(ApiErrorResponse), 400)]
        [ProducesResponseType(typeof(object), 401)]
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
        /// <remarks>
        /// Busca y retorna un alumno específico por su identificador único.
        /// 
        /// **Ejemplo de uso:**
        /// ```
        /// GET /api/alumnos/1
        /// X-API-Key: colegio-api-key-2024
        /// ```
        /// 
        /// **Respuesta exitosa:**
        /// ```json
        /// {
        ///   "success": true,
        ///   "data": {
        ///     "id": 1,
        ///     "nombreAlumno": "Juan Pérez García",
        ///     "fechaNacimiento": "2010-05-15",
        ///     "nombrePadre": "Carlos Pérez López",
        ///     "nombreMadre": "María García Hernández",
        ///     "grado": "5to",
        ///     "seccion": "A",
        ///     "fechaIngreso": "2021-02-01",
        ///     "edad": 13,
        ///     "gradoCompleto": "5to A"
        ///   },
        ///   "message": "Alumno obtenido exitosamente",
        ///   "timestamp": "2024-01-15T10:30:00Z"
        /// }
        /// ```
        /// </remarks>
        /// <param name="id">ID único del alumno (debe ser un número positivo)</param>
        /// <returns>Datos completos del alumno encontrado</returns>
        /// <response code="200">Alumno encontrado exitosamente</response>
        /// <response code="400">ID inválido (debe ser un número positivo)</response>
        /// <response code="401">No autorizado - API Key requerida o inválida</response>
        /// <response code="404">Alumno no encontrado con el ID especificado</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpGet("{id:int}")]
        [SwaggerOperation(Summary = "Obtener alumno por ID", Description = "Busca un alumno específico por su identificador único")]
        [ProducesResponseType(typeof(ApiResponse<AlumnoResponseDto>), 200)]
        [ProducesResponseType(typeof(ApiErrorResponse), 400)]
        [ProducesResponseType(typeof(object), 401)]
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
        /// <remarks>
        /// Registra un nuevo alumno en el sistema con validaciones automáticas.
        /// 
        /// **Validaciones aplicadas:**
        /// - Todos los campos son obligatorios
        /// - Nombres no pueden exceder 100 caracteres
        /// - Grado máximo 20 caracteres
        /// - Sección máximo 10 caracteres
        /// - Fecha de nacimiento no puede ser futura
        /// - Fecha de ingreso no puede ser anterior a la fecha de nacimiento
        /// 
        /// **Ejemplo de petición:**
        /// ```json
        /// {
        ///   "nombreAlumno": "María González Pérez",
        ///   "fechaNacimiento": "2011-07-20",
        ///   "nombrePadre": "Juan González",
        ///   "nombreMadre": "Ana Pérez",
        ///   "grado": "4to",
        ///   "seccion": "B",
        ///   "fechaIngreso": "2023-02-01"
        /// }
        /// ```
        /// 
        /// **Respuesta exitosa:**
        /// ```json
        /// {
        ///   "success": true,
        ///   "data": {
        ///     "id": 4,
        ///     "nombreAlumno": "María González Pérez",
        ///     "fechaNacimiento": "2011-07-20",
        ///     "nombrePadre": "Juan González",
        ///     "nombreMadre": "Ana Pérez",
        ///     "grado": "4to",
        ///     "seccion": "B",
        ///     "fechaIngreso": "2023-02-01",
        ///     "edad": 12,
        ///     "gradoCompleto": "4to B"
        ///   },
        ///   "message": "Alumno creado exitosamente",
        ///   "timestamp": "2024-01-15T10:30:00Z"
        /// }
        /// ```
        /// </remarks>
        /// <param name="alumnoDto">Datos del alumno a crear</param>
        /// <returns>Datos completos del alumno creado</returns>
        /// <response code="201">Alumno creado exitosamente</response>
        /// <response code="400">Datos de entrada inválidos o validaciones fallidas</response>
        /// <response code="401">No autorizado - API Key requerida o inválida</response>
        /// <response code="409">Conflicto - Alumno ya existe (futuro)</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpPost]
        [SwaggerOperation(Summary = "Crear nuevo alumno", Description = "Registra un nuevo alumno con validaciones automáticas")]
        [ProducesResponseType(typeof(ApiResponse<AlumnoResponseDto>), 201)]
        [ProducesResponseType(typeof(ApiErrorResponse), 400)]
        [ProducesResponseType(typeof(object), 401)]
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