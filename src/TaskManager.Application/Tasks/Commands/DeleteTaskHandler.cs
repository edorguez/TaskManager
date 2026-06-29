using FluentResults;
using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Domain.Interfaces;

namespace TaskManager.Application.Tasks.Commands;

public class DeleteTaskHandler(ITaskRepository repository, IUnitOfWork unitOfWork) : ICommandHandler<DeleteTaskCommand>
{
    public async Task<Result> Handle(DeleteTaskCommand command, CancellationToken ct)
    {
        var task = await repository.GetByIdAsync(command.Id, command.UserId);
        if (task is null)
            return Result.Fail("Task not found.");

        repository.Delete(task);
        await unitOfWork.SaveChangesAsync(ct);
        return Result.Ok();
    }
}
