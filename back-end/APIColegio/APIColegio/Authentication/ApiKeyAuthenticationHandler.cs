using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace APIColegio.Authentication
{
    public class ApiKeyAuthenticationHandler : AuthenticationHandler<ApiKeyAuthenticationSchemeOptions>
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ApiKeyAuthenticationHandler> _logger;

        public ApiKeyAuthenticationHandler(
            IOptionsMonitor<ApiKeyAuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            IConfiguration configuration)
            : base(options, logger, encoder)
        {
            _configuration = configuration;
            _logger = logger.CreateLogger<ApiKeyAuthenticationHandler>();
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Verificar si el header de API Key está presente
            if (!Request.Headers.TryGetValue(Options.ApiKeyHeaderName, out var apiKeyHeaderValues))
            {
                _logger.LogWarning("API Key header '{HeaderName}' no encontrado en la petición", Options.ApiKeyHeaderName);
                return Task.FromResult(AuthenticateResult.Fail("API Key header missing"));
            }

            var providedApiKey = apiKeyHeaderValues.FirstOrDefault();

            if (string.IsNullOrWhiteSpace(providedApiKey))
            {
                _logger.LogWarning("API Key header '{HeaderName}' está vacío", Options.ApiKeyHeaderName);
                return Task.FromResult(AuthenticateResult.Fail("API Key header empty"));
            }

            // Obtener la API Key válida desde la configuración
            var validApiKey = _configuration["ApiKey"];
            
            if (string.IsNullOrWhiteSpace(validApiKey))
            {
                _logger.LogError("API Key no está configurada en appsettings.json");
                return Task.FromResult(AuthenticateResult.Fail("API Key not configured"));
            }

            // Validar la API Key
            if (providedApiKey != validApiKey)
            {
                _logger.LogWarning("API Key inválida proporcionada: {ProvidedApiKey}", providedApiKey);
                return Task.FromResult(AuthenticateResult.Fail("Invalid API Key"));
            }

            // API Key válida - crear claims y ticket de autenticación
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, "API User"),
                new Claim(ClaimTypes.NameIdentifier, "api-user"),
                new Claim("ApiKeyAuthenticated", "true"),
                new Claim("AuthenticationTime", DateTime.UtcNow.ToString("O"))
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            _logger.LogInformation("API Key autenticada exitosamente para el usuario: API User");
            
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }

        protected override Task HandleChallengeAsync(AuthenticationProperties properties)
        {
            Response.StatusCode = 401;
            Response.ContentType = "application/json";
            
            var errorResponse = new
            {
                Success = false,
                Message = "Acceso no autorizado. Se requiere API Key válida.",
                ErrorCode = "UNAUTHORIZED",
                RequiredHeader = Options.ApiKeyHeaderName,
                Timestamp = DateTime.UtcNow
            };

            var json = System.Text.Json.JsonSerializer.Serialize(errorResponse);
            return Response.WriteAsync(json);
        }

        protected override Task HandleForbiddenAsync(AuthenticationProperties properties)
        {
            Response.StatusCode = 403;
            Response.ContentType = "application/json";
            
            var errorResponse = new
            {
                Success = false,
                Message = "Acceso prohibido. API Key válida pero sin permisos suficientes.",
                ErrorCode = "FORBIDDEN",
                Timestamp = DateTime.UtcNow
            };

            var json = System.Text.Json.JsonSerializer.Serialize(errorResponse);
            return Response.WriteAsync(json);
        }
    }
}