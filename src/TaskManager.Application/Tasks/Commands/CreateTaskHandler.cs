using FluentResults;
using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Contracts.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;
using Mapster;

namespace TaskManager.Application.Tasks.Commands;

public class CreateTaskHandler(ITaskRepository repository, IUnitOfWork unitOfWork, IDateTimeProvider dateTimeProvider) : ICommandHandler<CreateTaskCommand, TaskResponse>
{
    public async Task<Result<TaskResponse>> Handle(CreateTaskCommand command, CancellationToken ct)
    {
        var titleResult = TaskTitle.Create(command.Title);
        if (titleResult.IsFailed)
            return Result.Fail<TaskResponse>(titleResult.Errors.Select(e => e.Message));

        var dueDateResult = DueDate.Create(command.DueDate, dateTimeProvider);
        if (dueDateResult.IsFailed)
            return Result.Fail<TaskResponse>(dueDateResult.Errors.Select(e => e.Message));

        var taskResult = TaskItem.Create(titleResult.Value, command.Description, dueDateResult.Value, command.StatusId, command.UserId);
        if (taskResult.IsFailed)
            return Result.Fail<TaskResponse>(taskResult.Errors.Select(e => e.Message));

        await repository.AddAsync(taskResult.Value);
        await unitOfWork.SaveChangesAsync(ct);

        var savedTask = await repository.GetByIdAsync(taskResult.Value.Id, command.UserId);
        if (savedTask is null)
            return Result.Fail<TaskResponse>("Task was not saved correctly.");

        return Result.Ok(savedTask.Adapt<TaskResponse>());
    }
}
