using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;

namespace EntraAuth.Webservices.Host.Extensions;

public static class AzureAdAuthExtension
{
    public static void AddAzureEntraAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        //Two ways to configure 
        /*
         * Approach	                                    Flexibility	    Simplicity	Best For
           AddMicrosoftIdentityWebApiAuthentication()	❌ Limited	    ✅ Easy	    Azure AD, B2C, standard AAD setup
           AddJwtBearer()	                            ✅ High	        ❌ Manual	Advanced scenarios, multi-issuer APIs
         *
         *
         *Add below to appsettings.json
         *"AzureAd": {
                "Instance": "https://login.microsoftonline.com/",
                "Domain": "<your-domain>.onmicrosoft.com",
                "TenantId": "<tenant-id>",
                "ClientId": "<api-app-client-id>",
                "Audience": "<api-app-client-id>"
            }
         */


        /*
         * For Smaller Application.
         * Approach 1.
         * add package Microsoft.Identity.Web
         */

        //For small applications serves well.
        services.AddMicrosoftIdentityWebApiAuthentication(configuration, "AzureAd");

        //or below one
        //services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        //        .AddMicrosoftIdentityWebApi(options =>
        //                            {
        //                                configuration.Bind("AzureAd", options);
        //                                options.TokenValidationParameters.ValidAudience = configuration["AzureAd:Audience"];
        //                            }, options => { configuration.Bind("AzureAd", options); });




        //For Bigger Application.
        //Approach 2.
        var config = configuration.GetSection("AzureAd");
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                        .AddJwtBearer(options =>
                        {
                            options.Authority = $"{config["AzureAd:Instance"]}{config["AzureAd:TenantId"]}";
                            options.Audience = config["AzureAd:Audience"];
                            options.TokenValidationParameters = new TokenValidationParameters
                            {
                                ValidateIssuer = true,
                                ValidIssuer = $"{config["AzureAd:Instance"]}{config["AzureAd:TenantId"]}/v2.0",
                                RoleClaimType = "roles",
                                NameClaimType = "name",
                                ValidateAudience = true,
                                ValidAudience = config["AzureAd:Audience"],
                                ValidateIssuerSigningKey = true,
                                ValidateLifetime = true,
                                ClockSkew = TimeSpan.Zero // Optional: Reduce or eliminate clock skew
                            };
                        });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy =>
                policy.RequireClaim("role", "Admin"));

            options.AddPolicy("ManagerAndAdmin", policy =>
                policy.RequireClaim("role", "Admin")
                      .RequireClaim("role","Manager")); // Validate roles

            options.AddPolicy("ValidateTokenPolicy", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scp", "access_as_user"); // Validate scope //Checks if the token has a scope (scp) claim with the value "access_as_user".
            });
        });
    }

}
