using APIColegio.Authentication;
using APIColegio.Data;
using APIColegio.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Swashbuckle.AspNetCore.SwaggerUI;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configurar Entity Framework con PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
    
    // Solo habilitar errores detallados en desarrollo (sin logging de SQL)
    if (builder.Environment.IsDevelopment())
    {
        options.EnableDetailedErrors();
    }
});

// Configurar autenticación con API Key
builder.Services.AddAuthentication(ApiKeyAuthenticationSchemeOptions.DefaultScheme)
    .AddScheme<ApiKeyAuthenticationSchemeOptions, ApiKeyAuthenticationHandler>(
        ApiKeyAuthenticationSchemeOptions.DefaultScheme, 
        options => { });

// Configurar autorización
builder.Services.AddAuthorization();

// Configurar CORS para desarrollo frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:8080")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Registrar servicios de la aplicación
builder.Services.AddScoped<IAlumnoService, AlumnoService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "API Colegio - Sistema de Gestión de Alumnos", 
        Version = "v1.0.0",
        Description = @"
# API RESTful para Gestión de Alumnos

Esta API permite gestionar información de alumnos de un colegio, incluyendo:

## Funcionalidades
- ? **Crear alumnos** con información completa
- ? **Consultar alumnos** por ID, grado o todos
- ? **Validaciones de negocio** automáticas
- ? **Respuestas estructuradas** con metadatos

## Autenticación
- ?? **API Key requerida** para todos los endpoints de alumnos
- ?? Header: `X-API-Key: colegio-api-key-2024`

## Datos de Prueba
- ?? **3 alumnos precargados** para testing
- ?? **Diferentes grados y secciones** disponibles

## Tecnologías
- ? **.NET 8** con C# 12
- ?? **PostgreSQL** como base de datos
- ?? **Entity Framework Core** para ORM
- ?? **Docker** para contenedores
",
        Contact = new OpenApiContact
        {
            Name = "Soporte API Colegio",
            Email = "soporte@apicolegio.com",
            Url = new Uri("https://github.com/tu-usuario/api-colegio")
        },
        License = new OpenApiLicense
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        },
        TermsOfService = new Uri("https://apicolegio.com/terms")
    });

    // Configurar autenticación en Swagger
    c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Description = @"
**API Key Authentication**

Para usar esta API, necesitas incluir el header de autenticación en todas las peticiones:

```
X-API-Key: colegio-api-key-2024
```

### Cómo usarlo:
1. Haz clic en el botón 'Authorize' ??
2. Ingresa: `colegio-api-key-2024`
3. Haz clic en 'Authorize'
4. ¡Ahora puedes probar todos los endpoints! ??

**Nota:** Los endpoints de `/health` no requieren autenticación.
",
        In = ParameterLocation.Header,
        Name = "X-API-Key",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "ApiKeyScheme"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ApiKey"
                },
                In = ParameterLocation.Header,
                Name = "X-API-Key",
                Type = SecuritySchemeType.ApiKey
            },
            new string[] {}
        }
    });

    // Habilitar anotaciones de Swagger
    c.EnableAnnotations();

    // Incluir comentarios XML para documentación
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    // Configurar ejemplos y filtros
    c.UseInlineDefinitionsForEnums();
    
    // Ordenar endpoints por tags
    c.TagActionsBy(api => new[] { api.GroupName ?? api.ActionDescriptor.RouteValues["controller"] });
    c.DocInclusionPredicate((name, api) => true);
    
    // Configurar servers para diferentes entornos
    c.AddServer(new OpenApiServer 
    { 
        Url = "http://localhost:8080", 
        Description = "Docker Local" 
    });
    c.AddServer(new OpenApiServer 
    { 
        Url = "http://localhost:5000", 
        Description = "Desarrollo Local" 
    });
    c.AddServer(new OpenApiServer 
    { 
        Url = "https://api-colegio.com", 
        Description = "Producción" 
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
    
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Colegio V1.0.0");
    c.RoutePrefix = "swagger";
    
    // Configuraciones de UI mejoradas
    c.DisplayRequestDuration();
    c.EnableDeepLinking();
    c.EnableFilter();
    c.ShowExtensions();
    c.EnableValidator();
    c.SupportedSubmitMethods(SubmitMethod.Get, SubmitMethod.Post, SubmitMethod.Put, SubmitMethod.Delete);
    
    // Personalización visual
    c.DocExpansion(DocExpansion.None);
    c.DefaultModelExpandDepth(2);
    c.DefaultModelsExpandDepth(1);
    c.DisplayOperationId();
    
    // Información adicional
    c.DocumentTitle = "API Colegio - Documentación Interactiva";
});

// Configurar CORS antes de Authentication
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

// Middleware de autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Asegurar que la base de datos esté creada (con reintentos para Docker)
using (var scope = app.Services.CreateScope())
{
    var maxRetries = 5;
    var delay = TimeSpan.FromSeconds(5);
    
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            Console.WriteLine($"?? Intento {i + 1}/{maxRetries} - Verificando conexión a la base de datos...");
            
            // Verificar si se puede conectar
            await context.Database.CanConnectAsync();
            Console.WriteLine("? Conexión a PostgreSQL exitosa");
            
            // Crear la base de datos si no existe
            await context.Database.EnsureCreatedAsync();
            Console.WriteLine("? Base de datos configurada correctamente");
            
            // Verificar si hay datos
            var count = await context.Alumnos.CountAsync();
            Console.WriteLine($"?? Registros en la tabla alumnos: {count}");
            
            if (count > 0)
            {
                var alumnos = await context.Alumnos.Take(3).ToListAsync();
                Console.WriteLine("?? Algunos alumnos registrados:");
                foreach (var alumno in alumnos)
                {
                    Console.WriteLine($"   - {alumno.NombreAlumno} ({alumno.Grado} {alumno.Seccion})");
                }
            }
            
            break; // Conexión exitosa, salir del loop
        }
        catch (Exception ex)
        {
            Console.WriteLine($"? Intento {i + 1} falló: {ex.Message}");
            
            if (i == maxRetries - 1)
            {
                Console.WriteLine("?? Posibles soluciones:");
                Console.WriteLine("   1. Verificar que PostgreSQL esté ejecutándose");
                Console.WriteLine("   2. Verificar la cadena de conexión");
                Console.WriteLine("   3. Verificar conectividad de red");
            }
            else
            {
                Console.WriteLine($"? Reintentando en {delay.TotalSeconds} segundos...");
                await Task.Delay(delay);
            }
        }
    }
}

var environment = app.Environment.EnvironmentName;
var urls = app.Configuration["ASPNETCORE_URLS"] ?? "http://localhost:5000";

Console.WriteLine();
Console.WriteLine("?? API Colegio iniciada correctamente!");
Console.WriteLine($"?? Entorno: {environment}");
Console.WriteLine($"?? URLs disponibles: {urls}");
Console.WriteLine();
Console.WriteLine("?? Acceso rápido:");
Console.WriteLine("   ?? Swagger: /swagger");
Console.WriteLine("   ?? API Base: /api");
Console.WriteLine("   ?? API Key: colegio-api-key-2024");
Console.WriteLine("   ?? Health: /api/health");
Console.WriteLine();

app.Run();
