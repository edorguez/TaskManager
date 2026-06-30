using System.Net;
using System.Net.Http.Json;
using TaskManager.Contracts.Common;
using TaskManager.Contracts.Tasks;
using TaskManager.Infrastructure.Data;
using TaskManager.Tests.Testing;

namespace TaskManager.Tests.API;

public class TaskEndpointsTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public TaskEndpointsTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.SeedDatabase();
    }

    [Fact]
    public async Task GetHealth_ReturnsHealthy()
    {
        var response = await _client.GetAsync("/api/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<object>>();
        body.Should().NotBeNull();
    }

    // GET /api/tasks

    [Fact]
    public async Task GetAllTasks_WhenAuthenticated_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/tasks");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<IEnumerable<TaskResponse>>>();
        body.Should().NotBeNull();
        body!.Success.Should().BeTrue();
        body.Data.Should().NotBeNull();
    }

    // POST /api/tasks

    [Fact]
    public async Task CreateTask_WithValidData_ReturnsCreated()
    {
        var request = new { Title = "Test Task", Description = "Desc", DueDate = DateTime.UtcNow.AddDays(7), StatusId = 1 };

        var response = await _client.PostAsJsonAsync("/api/tasks", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<TaskResponse>>();
        body.Should().NotBeNull();
        body!.Success.Should().BeTrue();
        body.Data.Should().NotBeNull();
        body.Data!.Title.Should().Be("Test Task");
    }

    [Fact]
    public async Task CreateTask_WithEmptyTitle_ReturnsBadRequest()
    {
        var request = new { Title = "", Description = "Desc", DueDate = DateTime.UtcNow.AddDays(7), StatusId = 1 };

        var response = await _client.PostAsJsonAsync("/api/tasks", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    // GET /api/tasks/{id}

    [Fact]
    public async Task GetTaskById_WhenFound_ReturnsOk()
    {
        var created = await CreateTestTaskAsync();
        var createdBody = await created.Content.ReadFromJsonAsync<ApiResponse<TaskResponse>>();
        var taskId = createdBody!.Data!.Id;

        var response = await _client.GetAsync($"/api/tasks/{taskId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<TaskResponse>>();
        body!.Success.Should().BeTrue();
        body.Data!.Id.Should().Be(taskId);
    }

    [Fact]
    public async Task GetTaskById_WhenNotFound_ReturnsNotFound()
    {
        var response = await _client.GetAsync($"/api/tasks/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // PUT /api/tasks/{id}

    [Fact]
    public async Task UpdateTask_WithValidData_ReturnsOk()
    {
        var created = await CreateTestTaskAsync();
        var createdBody = await created.Content.ReadFromJsonAsync<ApiResponse<TaskResponse>>();
        var taskId = createdBody!.Data!.Id;

        var updateRequest = new { Title = "Updated", Description = "Updated desc", DueDate = DateTime.UtcNow.AddDays(14), StatusId = 2 };

        var response = await _client.PutAsJsonAsync($"/api/tasks/{taskId}", updateRequest);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<TaskResponse>>();
        body!.Success.Should().BeTrue();
        body.Data!.Title.Should().Be("Updated");
    }

    [Fact]
    public async Task UpdateTask_WithNonExistentId_ReturnsBadRequest()
    {
        var request = new { Title = "Updated", Description = "Desc", DueDate = DateTime.UtcNow.AddDays(7), StatusId = 1 };

        var response = await _client.PutAsJsonAsync($"/api/tasks/{Guid.NewGuid()}", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    // DELETE /api/tasks/{id}

    [Fact]
    public async Task DeleteTask_WithExistingId_ReturnsOk()
    {
        var created = await CreateTestTaskAsync();
        var createdBody = await created.Content.ReadFromJsonAsync<ApiResponse<TaskResponse>>();
        var taskId = createdBody!.Data!.Id;

        var response = await _client.DeleteAsync($"/api/tasks/{taskId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task DeleteTask_WithNonExistentId_ReturnsNotFound()
    {
        var response = await _client.DeleteAsync($"/api/tasks/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // GET /api/tasks/statuses

    [Fact]
    public async Task GetTaskStatuses_ReturnsAllStatuses()
    {
        var response = await _client.GetAsync("/api/tasks/statuses");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<IEnumerable<TaskStatusResponse>>>();
        body.Should().NotBeNull();
        body!.Success.Should().BeTrue();
        body.Data.Should().HaveCount(3);
    }

    private async Task<HttpResponseMessage> CreateTestTaskAsync()
    {
        var request = new { Title = "Integration Test Task", Description = "Created during test", DueDate = DateTime.UtcNow.AddDays(7), StatusId = 1 };
        return await _client.PostAsJsonAsync("/api/tasks", request);
    }
}
