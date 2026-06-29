using FluentResults;
using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Domain.Interfaces;

namespace TaskManager.Application.Tasks.Commands;

public class CompleteTaskHandler(ITaskRepository repository, IUnitOfWork unitOfWork) : ICommandHandler<CompleteTaskCommand>
{
    public async Task<Result> Handle(CompleteTaskCommand command, CancellationToken ct)
    {
        var task = await repository.GetByIdAsync(command.Id, command.UserId);
        if (task is null)
            return Result.Fail("Task not found.");

        var result = task.Complete();
        if (result.IsFailed)
            return result;

        repository.Update(task);
        await unitOfWork.SaveChangesAsync(ct);
        return Result.Ok();
    }
}
