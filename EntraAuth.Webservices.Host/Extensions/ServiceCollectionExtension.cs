namespace EntraAuth.Webservices.Host.Extensions;

public static class ServiceCollectionExtension
{
    public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAzureEntraAuthentication(configuration);
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
    }
}
