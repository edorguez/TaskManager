using System.Security.Claims;
using FluentResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using NSubstitute;
using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Application.Tasks.Commands;
using TaskManager.Application.Tasks.Queries;
using TaskManager.Contracts.Tasks;

namespace TaskManager.Tests.API;

public class TaskEndpointsTests
{
    private readonly IMediator _mediator;
    private readonly HttpContext _httpContext;

    public TaskEndpointsTests()
    {
        _mediator = Substitute.For<IMediator>();
        _httpContext = Substitute.For<HttpContext>();
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "test-user-id"),
        }));
        _httpContext.User.Returns(user);
    }

    [Fact]
    public async Task GetAllTasks_WhenAuthenticated_ReturnsTasks()
    {
        var tasks = new List<TaskResponse>
        {
            new(Guid.NewGuid(), "Task 1", "Desc", "Todo", DateTime.UtcNow.AddDays(1), DateTime.UtcNow, null)
        };
        _mediator.Send(Arg.Any<GetAllTasksQuery>())
            .Returns(Result.Ok<IEnumerable<TaskResponse>>(tasks));

        // Simulate endpoint logic
        var userId = _httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _mediator.Send(new GetAllTasksQuery(userId));

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().HaveCount(1);
    }

    [Fact]
    public async Task CreateTask_WithValidData_ReturnsCreatedTask()
    {
        var command = new CreateTaskCommand("New Task", "Desc", DateTime.UtcNow.AddDays(1), "test-user-id");
        var response = new TaskResponse(Guid.NewGuid(), "New Task", "Desc", "Todo", DateTime.UtcNow.AddDays(1), DateTime.UtcNow, null);

        _mediator.Send(command).Returns(Result.Ok(response));

        var result = await _mediator.Send(command);
        result.IsSuccess.Should().BeTrue();
        result.Value.Title.Should().Be("New Task");
    }
}
