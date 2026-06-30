using TaskManager.Domain.Common;
using TaskManager.Domain.Events;
using TaskManager.Domain.ValueObjects;
using FluentResults;

namespace TaskManager.Domain.Entities;

public class TaskItem : AggregateRoot
{
    private TaskItem() { }

    public Guid Id { get; private set; }
    public TaskTitle Title { get; private set; } = null!;
    public string Description { get; private set; } = string.Empty;
    public int StatusId { get; private set; }
    public TaskStatus Status { get; private set; } = null!;
    public DueDate DueDate { get; private set; } = null!;
    public string CreatedByUserId { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public static Result<TaskItem> Create(TaskTitle title, string description, DueDate dueDate, int statusId, string createdByUserId)
    {
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description ?? string.Empty,
            StatusId = statusId,
            DueDate = dueDate,
            CreatedByUserId = createdByUserId,
            CreatedAt = DateTime.UtcNow
        };

        task.RaiseDomainEvent(new TaskCreatedDomainEvent(task.Id, task.CreatedByUserId));
        return Result.Ok(task);
    }

    public Result Update(TaskTitle title, string description, DueDate dueDate)
    {
        Title = title;
        Description = description ?? string.Empty;
        DueDate = dueDate;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new TaskUpdatedDomainEvent(Id, CreatedByUserId));
        return Result.Ok();
    }

    public Result Start()
    {
        if (StatusId != 1)
            return Result.Fail("Only tasks with Todo status can be started.");

        StatusId = 2;
        UpdatedAt = DateTime.UtcNow;
        return Result.Ok();
    }

    public Result ChangeStatus(int newStatusId)
    {
        if (newStatusId < 1 || newStatusId > 3)
            return Result.Fail("Invalid status.");

        if (StatusId == newStatusId)
            return Result.Ok();

        StatusId = newStatusId;
        UpdatedAt = DateTime.UtcNow;
        return Result.Ok();
    }
}
