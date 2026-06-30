FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/TaskManager.API/TaskManager.API.csproj", "src/TaskManager.API/"]
COPY ["src/TaskManager.Application/TaskManager.Application.csproj", "src/TaskManager.Application/"]
COPY ["src/TaskManager.Domain/TaskManager.Domain.csproj", "src/TaskManager.Domain/"]
COPY ["src/TaskManager.Contracts/TaskManager.Contracts.csproj", "src/TaskManager.Contracts/"]
COPY ["src/TaskManager.Infrastructure/TaskManager.Infrastructure.csproj", "src/TaskManager.Infrastructure/"]
RUN dotnet restore "src/TaskManager.API/TaskManager.API.csproj"
COPY . .
RUN dotnet publish "src/TaskManager.API/TaskManager.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
USER $APP_UID
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1
ENTRYPOINT ["dotnet", "TaskManager.API.dll"]
