using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace APIColegio.Controllers
{
    /// <summary>
    /// Controlador de salud y diagnostico del sistema
    /// </summary>
    /// <remarks>
    /// Este controlador proporciona endpoints publicos para:
    /// - Verificar el estado de la API
    /// - Obtener informacion basica del sistema
    /// - Monitoreo y diagnostico
    /// 
    /// **No requiere autenticacion**
    /// </remarks>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [SwaggerTag("Salud y diagnostico del sistema")]
    public class HealthController : ControllerBase
    {
        private readonly ILogger<HealthController> _logger;

        /// <summary>
        /// Constructor del controlador de salud
        /// </summary>
        /// <param name="logger">Logger para el controlador</param>
        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Verificar el estado de salud de la API
        /// </summary>
        /// <remarks>
        /// Endpoint publico para verificar que la API este funcionando correctamente.
        /// Util para monitoreo, load balancers y sistemas de orquestacion.
        /// 
        /// **Ejemplo de uso:**
        /// ```
        /// GET /api/health
        /// ```
        /// 
        /// **Respuesta tipica:**
        /// ```json
        /// {
        ///   "status": "Healthy",
        ///   "message": "API Colegio funcionando correctamente",
        ///   "timestamp": "2024-01-15T10:30:00Z",
        ///   "version": "1.0.0",
        ///   "environment": "Development"
        /// }
        /// ```
        /// </remarks>
        /// <returns>Estado de salud de la API</returns>
        /// <response code="200">API funcionando correctamente</response>
        [HttpGet]
        [SwaggerOperation(Summary = "Health Check", Description = "Verifica que la API este funcionando correctamente")]
        [ProducesResponseType(typeof(object), 200)]
        public ActionResult GetHealth()
        {
            var healthStatus = new
            {
                Status = "Healthy",
                Message = "API Colegio funcionando correctamente",
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
                Uptime = Environment.TickCount64 / 1000 // segundos
            };

            _logger.LogInformation("Health check realizado exitosamente");
            
            return Ok(healthStatus);
        }

        /// <summary>
        /// Obtener informacion general de la API
        /// </summary>
        /// <remarks>
        /// Proporciona informacion basica sobre la API, sus endpoints disponibles 
        /// y requisitos de autenticacion.
        /// 
        /// **Ejemplo de uso:**
        /// ```
        /// GET /api/health/info
        /// ```
        /// 
        /// **Informacion incluida:**
        /// - Nombre y version de la API
        /// - Lista de endpoints principales
        /// - Requisitos de autenticacion
        /// - Enlaces a documentacion
        /// 
        /// Este endpoint es util para descubrimiento de API y documentacion automatica.
        /// </remarks>
        /// <returns>Informacion basica de la API</returns>
        /// <response code="200">Informacion de la API obtenida exitosamente</response>
        [HttpGet("info")]
        [SwaggerOperation(Summary = "Informacion de la API", Description = "Obtiene informacion general sobre la API y sus capabilities")]
        [ProducesResponseType(typeof(object), 200)]
        public ActionResult GetInfo()
        {
            var apiInfo = new
            {
                Name = "API Colegio",
                Version = "1.0.0",
                Description = "API RESTful para gestion de alumnos del colegio",
                AuthenticationRequired = true,
                ApiKeyHeader = "X-API-Key",
                DefaultApiKey = "colegio-api-key-2024",
                Endpoints = new[]
                {
                    new { Method = "GET", Path = "/api/alumnos", Description = "Obtener todos los alumnos", Auth = true },
                    new { Method = "GET", Path = "/api/alumnos/{id}", Description = "Obtener alumno por ID", Auth = true },
                    new { Method = "GET", Path = "/api/alumnos/grado/{grado}", Description = "Obtener alumnos por grado", Auth = true },
                    new { Method = "POST", Path = "/api/alumnos", Description = "Crear nuevo alumno", Auth = true },
                    new { Method = "GET", Path = "/api/health", Description = "Health check", Auth = false },
                    new { Method = "GET", Path = "/api/health/info", Description = "Informacion de la API", Auth = false }
                },
                Documentation = "/swagger",
                Repository = "https://github.com/tu-usuario/api-colegio",
                Contact = "soporte@apicolegio.com",
                License = "MIT",
                Timestamp = DateTime.UtcNow
            };

            return Ok(apiInfo);
        }

        /// <summary>
        /// Verificar conectividad con servicios externos
        /// </summary>
        /// <remarks>
        /// Verifica la conectividad con servicios criticos como la base de datos.
        /// 
        /// **Servicios verificados:**
        /// - Conexion a PostgreSQL
        /// - Estado de Entity Framework
        /// - Disponibilidad de servicios registrados
        /// 
        /// Este endpoint es util para diagnosticos profundos del sistema.
        /// </remarks>
        /// <returns>Estado detallado de conectividad</returns>
        /// <response code="200">Verificacion completada</response>
        /// <response code="503">Uno o mas servicios no estan disponibles</response>
        [HttpGet("detailed")]
        [SwaggerOperation(Summary = "Health Check Detallado", Description = "Verifica la conectividad con servicios externos")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 503)]
        public async Task<ActionResult> GetDetailedHealth([FromServices] IServiceProvider serviceProvider)
        {
            var healthChecks = new List<object>();
            var overallHealthy = true;

            try
            {
                // Verificar Entity Framework
                var dbContext = serviceProvider.GetService<APIColegio.Data.ApplicationDbContext>();
                if (dbContext != null)
                {
                    var canConnect = await dbContext.Database.CanConnectAsync();
                    healthChecks.Add(new
                    {
                        Service = "PostgreSQL Database",
                        Status = canConnect ? "Healthy" : "Unhealthy",
                        Details = canConnect ? "Conexion exitosa" : "No se puede conectar"
                    });
                    if (!canConnect) overallHealthy = false;
                }

                // Verificar servicios registrados
                var alumnoService = serviceProvider.GetService<APIColegio.Services.IAlumnoService>();
                healthChecks.Add(new
                {
                    Service = "Alumno Service",
                    Status = alumnoService != null ? "Healthy" : "Unhealthy",
                    Details = alumnoService != null ? "Servicio disponible" : "Servicio no registrado"
                });
                if (alumnoService == null) overallHealthy = false;

            }
            catch (Exception ex)
            {
                healthChecks.Add(new
                {
                    Service = "System Check",
                    Status = "Unhealthy",
                    Details = ex.Message
                });
                overallHealthy = false;
            }

            var result = new
            {
                OverallStatus = overallHealthy ? "Healthy" : "Unhealthy",
                Timestamp = DateTime.UtcNow,
                Checks = healthChecks
            };

            _logger.LogInformation("Health check detallado completado. Estado: {Status}", result.OverallStatus);

            return overallHealthy ? Ok(result) : StatusCode(503, result);
        }
    }
}