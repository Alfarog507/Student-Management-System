using APIColegio.Authentication;
using APIColegio.Data;
using APIColegio.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

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

// Registrar servicios de la aplicación
builder.Services.AddScoped<IAlumnoService, AlumnoService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "API Colegio", 
        Version = "v1",
        Description = "API para gestión de alumnos del colegio con autenticación API Key",
        Contact = new OpenApiContact
        {
            Name = "API Colegio Support",
            Email = "support@apicolegio.com"
        }
    });

    // Configurar autenticación en Swagger
    c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Description = "API Key necesaria para acceder a los endpoints. Formato: X-API-Key: {tu-api-key}",
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

    // Incluir comentarios XML para documentación
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Colegio V1");
        c.RoutePrefix = "swagger";
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
    });
}

app.UseHttpsRedirection();

// Middleware de autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Asegurar que la base de datos esté creada
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        Console.WriteLine(" Verificando conexión a la base de datos...");
        
        // Verificar si se puede conectar
        await context.Database.CanConnectAsync();
        Console.WriteLine(" Conexión a PostgreSQL exitosa");
        
        // Crear la base de datos si no existe
        await context.Database.EnsureCreatedAsync();
        Console.WriteLine(" Base de datos configurada correctamente");
        
        // Verificar si hay datos
        var count = await context.Alumnos.CountAsync();
        Console.WriteLine($" Registros en la tabla alumnos: {count}");
        
        if (count > 0)
        {
            var alumnos = await context.Alumnos.Take(3).ToListAsync();
            Console.WriteLine(" Algunos alumnos registrados:");
            foreach (var alumno in alumnos)
            {
                Console.WriteLine($"   - {alumno.NombreAlumno} ({alumno.Grado} {alumno.Seccion})");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($" Error al configurar la base de datos: {ex.Message}");
        Console.WriteLine();
        Console.WriteLine(" Posibles soluciones:");
        Console.WriteLine("   1. Iniciar Docker Desktop y ejecutar: docker-compose up -d");
        Console.WriteLine("   2. Instalar PostgreSQL localmente");
        Console.WriteLine("   3. Verificar la cadena de conexión en appsettings.json");
        Console.WriteLine();
        Console.WriteLine(" Para más ayuda, ejecuta: test-connection.bat");
    }
}

Console.WriteLine();
Console.WriteLine(" Aplicación iniciada. Accede a:");
Console.WriteLine("    Swagger: http://localhost:7027/swagger");
Console.WriteLine("    API Base: http://localhost:7027/api");
Console.WriteLine();

app.Run();
