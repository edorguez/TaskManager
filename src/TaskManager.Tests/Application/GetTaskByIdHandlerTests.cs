using NSubstitute;
using TaskManager.Application.Tasks.Queries;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;

namespace TaskManager.Tests.Application;

public class GetTaskByIdHandlerTests
{
    [Fact]
    public async Task Handle_WithExistingTask_ReturnsTask()
    {
        var repository = Substitute.For<ITaskRepository>();
        var dateTimeProvider = Substitute.For<IDateTimeProvider>();
        dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));
        var title = TaskTitle.Create("Test").Value;
        var dueDate = DueDate.Create(new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), dateTimeProvider).Value;
        var task = TaskItem.Create(title, "Desc", dueDate, 1, "user-1").Value;
        var query = new GetTaskByIdQuery(task.Id, "user-1");

        repository.GetByIdAsync(task.Id, "user-1").Returns(task);

        var handler = new GetTaskByIdHandler(repository);
        var result = await handler.Handle(query, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Title.Should().Be("Test");
    }

    [Fact]
    public async Task Handle_WithNonExistentTask_ReturnsFailure()
    {
        var repository = Substitute.For<ITaskRepository>();
        var query = new GetTaskByIdQuery(Guid.NewGuid(), "user-1");

        repository.GetByIdAsync(query.Id, query.UserId).Returns((TaskItem?)null);

        var handler = new GetTaskByIdHandler(repository);
        var result = await handler.Handle(query, CancellationToken.None);

        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "Task not found.");
    }
}
