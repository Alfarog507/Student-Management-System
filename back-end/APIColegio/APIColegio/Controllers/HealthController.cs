using Microsoft.AspNetCore.Mvc;

namespace APIColegio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class HealthController : ControllerBase
    {
        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Verificar el estado de la API
        /// </summary>
        /// <returns>Estado de salud de la API</returns>
        /// <response code="200">API funcionando correctamente</response>
        [HttpGet]
        [ProducesResponseType(typeof(object), 200)]
        public ActionResult GetHealth()
        {
            var healthStatus = new
            {
                Status = "Healthy",
                Message = "API Colegio funcionando correctamente",
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
            };

            _logger.LogInformation("Health check realizado exitosamente");
            
            return Ok(healthStatus);
        }

        /// <summary>
        /// Información de la API (sin autenticación requerida)
        /// </summary>
        /// <returns>Información básica de la API</returns>
        /// <response code="200">Información de la API</response>
        [HttpGet("info")]
        [ProducesResponseType(typeof(object), 200)]
        public ActionResult GetInfo()
        {
            var apiInfo = new
            {
                Name = "API Colegio",
                Version = "1.0.0",
                Description = "API RESTful para gestión de alumnos del colegio",
                AuthenticationRequired = true,
                ApiKeyHeader = "X-API-Key",
                Endpoints = new[]
                {
                    "GET /api/alumnos - Obtener todos los alumnos",
                    "GET /api/alumnos/{id} - Obtener alumno por ID",
                    "GET /api/alumnos/grado/{grado} - Obtener alumnos por grado",
                    "POST /api/alumnos - Crear nuevo alumno"
                },
                Documentation = "/swagger",
                Timestamp = DateTime.UtcNow
            };

            return Ok(apiInfo);
        }
    }
}