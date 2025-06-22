
namespace EntraAuth.React.UI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Required for production builds to locate the static files folder. wwwroot is default, with AddSpaStaticFiles() we can update the static files folder.
            builder.Services.AddSpaStaticFiles(config => 
            {
                config.RootPath = "wwwroot";
            });

            //the AddHsts() middleware enforces HTTP Strict Transport Security (HSTS)
            builder.Services.AddHsts(options =>
            {
                options.Preload = true; // Submit to browser preload lists
                options.IncludeSubDomains = true; // Protect subdomains
                options.MaxAge = TimeSpan.FromDays(30); // Cache duration
            });

            var app = builder.Build();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.UseSpa(spa => { });

            app.Run();
        }
    }
}
