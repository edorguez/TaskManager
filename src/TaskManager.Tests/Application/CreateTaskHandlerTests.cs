using FluentResults;
using NSubstitute;
using TaskManager.Application.Tasks.Commands;
using TaskManager.Contracts.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;

namespace TaskManager.Tests.Application;

public class CreateTaskHandlerTests
{
    private readonly ITaskRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly CreateTaskHandler _handler;

    public CreateTaskHandlerTests()
    {
        _repository = Substitute.For<ITaskRepository>();
        _unitOfWork = Substitute.For<IUnitOfWork>();
        _dateTimeProvider = Substitute.For<IDateTimeProvider>();
        _dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));
        _handler = new CreateTaskHandler(_repository, _unitOfWork, _dateTimeProvider);
    }

    [Fact]
    public async Task Handle_WithValidCommand_ReturnsSuccess()
    {
        var command = new CreateTaskCommand(
            "Test Task",
            "Description",
            new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
            1,
            "user-1"
        );

        var title = TaskTitle.Create(command.Title).Value;
        var dueDate = DueDate.Create(command.DueDate, _dateTimeProvider).Value;
        var task = TaskItem.Create(title, command.Description, dueDate, command.StatusId, command.UserId).Value;

        _repository.AddAsync(Arg.Any<TaskItem>()).Returns(Task.CompletedTask);
        _unitOfWork.SaveChangesAsync(Arg.Any<CancellationToken>()).Returns(1);

        // Mock GetByIdAsync to return the task with status
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<string>())
            .Returns(Task.FromResult<TaskItem?>(task));

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Title.Should().Be("Test Task");
    }

    [Fact]
    public async Task Handle_WithEmptyTitle_ReturnsFailure()
    {
        var command = new CreateTaskCommand(
            "",
            "Description",
            new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
            1,
            "user-1"
        );

        _dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailed.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_WithPastDueDate_ReturnsFailure()
    {
        var command = new CreateTaskCommand(
            "Test Task",
            "Description",
            new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            1,
            "user-1"
        );

        _dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailed.Should().BeTrue();
    }
}
