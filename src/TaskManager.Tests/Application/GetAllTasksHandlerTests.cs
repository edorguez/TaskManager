using NSubstitute;
using TaskManager.Application.Tasks.Queries;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;

namespace TaskManager.Tests.Application;

public class GetAllTasksHandlerTests
{
    [Fact]
    public async Task Handle_WithTasks_ReturnsTasksForUser()
    {
        var repository = Substitute.For<ITaskRepository>();
        var dateTimeProvider = Substitute.For<IDateTimeProvider>();
        dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));

        var title = TaskTitle.Create("Task 1").Value;
        var dueDate = DueDate.Create(new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), dateTimeProvider).Value;
        var task = TaskItem.Create(title, "", dueDate, "user-1").Value;

        var tasks = new List<TaskItem> { task };
        repository.GetAllByUserAsync("user-1").Returns(tasks.AsEnumerable());

        var handler = new GetAllTasksHandler(repository);
        var query = new GetAllTasksQuery("user-1");

        var result = await handler.Handle(query, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().HaveCount(1);
    }

    [Fact]
    public async Task Handle_WithNoTasks_ReturnsEmptyList()
    {
        var repository = Substitute.For<ITaskRepository>();
        repository.GetAllByUserAsync("user-1").Returns(Enumerable.Empty<TaskItem>());

        var handler = new GetAllTasksHandler(repository);
        var query = new GetAllTasksQuery("user-1");

        var result = await handler.Handle(query, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEmpty();
    }
}
