using TaskManager.Domain.Entities;
using TaskManager.Domain.Events;
using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;

namespace TaskManager.Tests.Domain;

public class TaskItemTests
{
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly TaskTitle _validTitle;
    private readonly DueDate _validDueDate;
    private const string UserId = "user-1";

    public TaskItemTests()
    {
        _dateTimeProvider = Substitute.For<IDateTimeProvider>();
        _dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));
        _validTitle = TaskTitle.Create("Test Task").Value;
        _validDueDate = DueDate.Create(new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), _dateTimeProvider).Value;
    }

    [Fact]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var result = TaskItem.Create(_validTitle, "Description", _validDueDate, 1, UserId);
        result.IsSuccess.Should().BeTrue();
        var task = result.Value;
        task.Title.Should().Be(_validTitle);
        task.Description.Should().Be("Description");
        task.StatusId.Should().Be(1);
        task.CreatedByUserId.Should().Be(UserId);
        task.DomainEvents.Should().Contain(e => e.GetType().Name == "TaskCreatedDomainEvent");
    }

    [Fact]
    public void Create_SetsInitialStatusToTodo()
    {
        var result = TaskItem.Create(_validTitle, "", _validDueDate, 1, UserId);
        result.Value.StatusId.Should().Be(1);
    }

    [Fact]
    public void Start_WithTodoStatus_TransitionsToInProgress()
    {
        var task = TaskItem.Create(_validTitle, "", _validDueDate, 1, UserId).Value;
        var result = task.Start();
        result.IsSuccess.Should().BeTrue();
        task.StatusId.Should().Be(2);
    }

    [Fact]
    public void Update_WithValidData_UpdatesTask()
    {
        var task = TaskItem.Create(_validTitle, "", _validDueDate, 1, UserId).Value;
        var newTitle = TaskTitle.Create("Updated").Value;
        var newDueDate = DueDate.Create(new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc), _dateTimeProvider).Value;
        
        var result = task.Update(newTitle, "Updated description", newDueDate);
        result.IsSuccess.Should().BeTrue();
        task.Title.Should().Be(newTitle);
        task.Description.Should().Be("Updated description");
    }

    [Fact]
    public void Update_RaisesTaskUpdatedDomainEvent()
    {
        var task = TaskItem.Create(_validTitle, "", _validDueDate, 1, UserId).Value;
        var newTitle = TaskTitle.Create("Updated").Value;
        var newDueDate = DueDate.Create(new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc), _dateTimeProvider).Value;

        task.Update(newTitle, "Updated description", newDueDate);

        task.DomainEvents.Should().Contain(e => e.GetType().Name == "TaskUpdatedDomainEvent");
    }

    [Fact]
    public void Start_WhenNotTodo_ReturnsFailure()
    {
        var task = TaskItem.Create(_validTitle, "", _validDueDate, 2, UserId).Value;

        var result = task.Start();

        result.IsFailed.Should().BeTrue();
    }

    [Fact]
    public void ChangeStatus_ToValidStatus_UpdatesStatus()
    {
        var task = TaskItem.Create(_validTitle, "", _validDueDate, 1, UserId).Value;

        var result = task.ChangeStatus(2);

        result.IsSuccess.Should().BeTrue();
        task.StatusId.Should().Be(2);
    }

    [Fact]
    public void ChangeStatus_WithInvalidStatus_ReturnsFailure()
    {
        var task = TaskItem.Create(_validTitle, "", _validDueDate, 1, UserId).Value;

        var result = task.ChangeStatus(0);

        result.IsFailed.Should().BeTrue();
    }

    [Fact]
    public void ChangeStatus_WithSameStatus_ReturnsOk()
    {
        var task = TaskItem.Create(_validTitle, "", _validDueDate, 1, UserId).Value;

        var result = task.ChangeStatus(1);

        result.IsSuccess.Should().BeTrue();
        task.StatusId.Should().Be(1);
    }
}
