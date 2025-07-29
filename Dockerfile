## See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.
#
## This stage is used when running from VS in fast mode (Default for Debug configuration)
#FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
#USER $APP_UID
#WORKDIR /app
#EXPOSE 8080
#EXPOSE 8081
#
#
## This stage is used to build the service project
#FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
#ARG BUILD_CONFIGURATION=Release
#WORKDIR /src
#COPY ["WF.WebServices.Host/WF.WebServices.Host.csproj", "WF.WebServices.Host/"]
#RUN dotnet restore "./WF.WebServices.Host/WF.WebServices.Host.csproj"
#COPY . .
#WORKDIR "/src/WF.WebServices.Host"
#RUN dotnet build "./WF.WebServices.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build
#
## This stage is used to publish the service project to be copied to the final stage
#FROM build AS publish
#ARG BUILD_CONFIGURATION=Release
#RUN dotnet publish "./WF.WebServices.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
#
## This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app/publish .
#ENTRYPOINT ["dotnet", "WF.WebServices.Host.dll"]
#

# Stage 1: Build React frontend
FROM node:20 AS client-build
WORKDIR /app/client
COPY wf.react.clientapp/ ./
RUN npm install
RUN npm run build

# Stage 2: Build .NET Web API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
WORKDIR /src/WF.WebServices.Host
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
COPY --from=client-build /app/client/dist ./wwwroot

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "WF.WebServices.Host.dll"]
