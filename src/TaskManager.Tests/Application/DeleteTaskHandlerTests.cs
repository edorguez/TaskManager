using FluentResults;
using NSubstitute;
using TaskManager.Application.Tasks.Commands;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;

namespace TaskManager.Tests.Application;

public class DeleteTaskHandlerTests
{
    private readonly ITaskRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly DeleteTaskHandler _handler;

    public DeleteTaskHandlerTests()
    {
        _repository = Substitute.For<ITaskRepository>();
        _unitOfWork = Substitute.For<IUnitOfWork>();
        _handler = new DeleteTaskHandler(_repository, _unitOfWork);
    }

    [Fact]
    public async Task Handle_WithExistingTask_DeletesAndReturnsSuccess()
    {
        var dateTimeProvider = Substitute.For<IDateTimeProvider>();
        dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));
        var title = TaskTitle.Create("Test").Value;
        var dueDate = DueDate.Create(new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), dateTimeProvider).Value;
        var task = TaskItem.Create(title, "", dueDate, 1, "user-1").Value;
        var command = new DeleteTaskCommand(task.Id, "user-1");

        _repository.GetByIdAsync(task.Id, "user-1").Returns(task);
        _unitOfWork.SaveChangesAsync(Arg.Any<CancellationToken>()).Returns(1);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _repository.Received(1).Delete(task);
    }

    [Fact]
    public async Task Handle_WithNonExistentTask_ReturnsFailure()
    {
        var command = new DeleteTaskCommand(Guid.NewGuid(), "user-1");

        _repository.GetByIdAsync(command.Id, command.UserId).Returns((TaskItem?)null);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "Task not found.");
    }
}
