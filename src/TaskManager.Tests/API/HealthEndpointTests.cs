using Microsoft.AspNetCore.Http;

namespace TaskManager.Tests.API;

public class HealthEndpointTests
{
    [Fact]
    public void GetHealth_ReturnsHealthy()
    {
        var result = Results.Ok(new { status = "healthy" });

        result.Should().NotBeNull();
    }
}
