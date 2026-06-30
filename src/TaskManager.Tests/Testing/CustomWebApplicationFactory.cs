using System.Data.Common;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Data;
using TaskStatus = TaskManager.Domain.Entities.TaskStatus;

namespace TaskManager.Tests.Testing;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly DbConnection _connection;

    public CustomWebApplicationFactory()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("ConnectionStrings:DefaultConnection", "Test");

        builder.ConfigureTestServices(services =>
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(_connection));

            services.AddAuthentication("Test")
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", null);

            services.Configure<AuthenticationOptions>(options =>
            {
                options.DefaultAuthenticateScheme = "Test";
                options.DefaultChallengeScheme = "Test";
            });
        });
    }

    public void SeedDatabase()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.EnsureCreated();

        if (!db.TaskStatuses.Any())
        {
            db.TaskStatuses.AddRange(
                new TaskStatus { Id = 1, Name = "Todo" },
                new TaskStatus { Id = 2, Name = "InProgress" },
                new TaskStatus { Id = 3, Name = "Done" }
            );
            db.SaveChanges();
        }
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
            _connection?.Close();
        base.Dispose(disposing);
    }
}
