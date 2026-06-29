using FluentResults;
using NSubstitute;
using TaskManager.Application.Tasks.Commands;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;

namespace TaskManager.Tests.Application;

public class UpdateTaskHandlerTests
{
    [Fact]
    public async Task Handle_WithValidCommand_UpdatesTask()
    {
        var repository = Substitute.For<ITaskRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();
        var dateTimeProvider = Substitute.For<IDateTimeProvider>();
        dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));

        var title = TaskTitle.Create("Original").Value;
        var dueDate = DueDate.Create(new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), dateTimeProvider).Value;
        var task = TaskItem.Create(title, "Original desc", dueDate, 1, "user-1").Value;

        repository.GetByIdAsync(task.Id, "user-1").Returns(task);
        unitOfWork.SaveChangesAsync(Arg.Any<CancellationToken>()).Returns(1);

        // Mock the GetByIdAsync after update to return the same task
        repository.GetByIdAsync(task.Id, "user-1").Returns(task);

        var handler = new UpdateTaskHandler(repository, unitOfWork, dateTimeProvider);
        var command = new UpdateTaskCommand(
            task.Id,
            "Updated Title",
            "Updated desc",
            new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc),
            2,
            "user-1"
        );

        var result = await handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
    }
}
