using FluentResults;
using Mapster;
using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Contracts.Tasks;
using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;

namespace TaskManager.Application.Tasks.Commands;

public class UpdateTaskHandler(ITaskRepository repository, IUnitOfWork unitOfWork, IDateTimeProvider dateTimeProvider) : ICommandHandler<UpdateTaskCommand, TaskResponse>
{
    public async Task<Result<TaskResponse>> Handle(UpdateTaskCommand command, CancellationToken ct)
    {
        var task = await repository.GetByIdAsync(command.Id, command.UserId);
        if (task is null)
            return Result.Fail<TaskResponse>("Task not found.");

        var titleResult = TaskTitle.Create(command.Title);
        if (titleResult.IsFailed)
            return Result.Fail<TaskResponse>(titleResult.Errors.Select(e => e.Message));

        var dueDateResult = DueDate.Create(command.DueDate, dateTimeProvider);
        if (dueDateResult.IsFailed)
            return Result.Fail<TaskResponse>(dueDateResult.Errors.Select(e => e.Message));

        var updateResult = task.Update(titleResult.Value, command.Description, dueDateResult.Value);
        if (updateResult.IsFailed)
            return Result.Fail<TaskResponse>(updateResult.Errors.Select(e => e.Message));

        if (command.StatusId == 2)
            task.Start();
        else if (command.StatusId == 3)
            task.Complete();

        repository.Update(task);
        await unitOfWork.SaveChangesAsync(ct);

        var updatedTask = await repository.GetByIdAsync(command.Id, command.UserId);
        return Result.Ok(updatedTask!.Adapt<TaskResponse>());
    }
}
