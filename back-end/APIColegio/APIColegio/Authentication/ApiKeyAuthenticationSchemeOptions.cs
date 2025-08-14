using Microsoft.AspNetCore.Authentication;

namespace APIColegio.Authentication
{
    public class ApiKeyAuthenticationSchemeOptions : AuthenticationSchemeOptions
    {
        public const string DefaultScheme = "ApiKey";
        public string ApiKeyHeaderName { get; set; } = "X-API-Key";
    }
}