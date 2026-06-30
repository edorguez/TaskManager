using FluentResults;
using NSubstitute;
using TaskManager.Application.Tasks.Commands;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;

namespace TaskManager.Tests.Application;

public class UpdateTaskHandlerTests
{
    private readonly ITaskRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly TaskItem _existingTask;

    public UpdateTaskHandlerTests()
    {
        _repository = Substitute.For<ITaskRepository>();
        _unitOfWork = Substitute.For<IUnitOfWork>();
        _dateTimeProvider = Substitute.For<IDateTimeProvider>();
        _dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));

        var title = TaskTitle.Create("Original").Value;
        var dueDate = DueDate.Create(new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), _dateTimeProvider).Value;
        _existingTask = TaskItem.Create(title, "Original desc", dueDate, 1, "user-1").Value;

        _repository.GetByIdAsync(_existingTask.Id, "user-1").Returns(_existingTask);
        _unitOfWork.SaveChangesAsync(Arg.Any<CancellationToken>()).Returns(1);
    }

    [Fact]
    public async Task Handle_WithValidCommand_UpdatesTask()
    {
        var handler = new UpdateTaskHandler(_repository, _unitOfWork, _dateTimeProvider);
        var command = new UpdateTaskCommand(
            _existingTask.Id,
            "Updated Title",
            "Updated desc",
            new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc),
            2,
            "user-1"
        );

        var result = await handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_WithNonExistentTask_ReturnsFailure()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns((TaskItem?)null);

        var handler = new UpdateTaskHandler(_repository, _unitOfWork, _dateTimeProvider);
        var command = new UpdateTaskCommand(
            Guid.NewGuid(),
            "Title",
            "Desc",
            new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc),
            2,
            "user-1"
        );

        var result = await handler.Handle(command, CancellationToken.None);

        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "Task not found.");
    }

    [Fact]
    public async Task Handle_WithEmptyTitle_ReturnsFailure()
    {
        var handler = new UpdateTaskHandler(_repository, _unitOfWork, _dateTimeProvider);
        var command = new UpdateTaskCommand(
            _existingTask.Id,
            "",
            "Desc",
            new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc),
            2,
            "user-1"
        );

        var result = await handler.Handle(command, CancellationToken.None);

        result.IsFailed.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_WithPastDueDate_ReturnsFailure()
    {
        var handler = new UpdateTaskHandler(_repository, _unitOfWork, _dateTimeProvider);
        var command = new UpdateTaskCommand(
            _existingTask.Id,
            "Title",
            "Desc",
            new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            2,
            "user-1"
        );

        var result = await handler.Handle(command, CancellationToken.None);

        result.IsFailed.Should().BeTrue();
    }
}
