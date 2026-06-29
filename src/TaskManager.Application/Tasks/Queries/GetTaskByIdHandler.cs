using FluentResults;
using Mapster;
using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Contracts.Tasks;
using TaskManager.Domain.Interfaces;

namespace TaskManager.Application.Tasks.Queries;

public class GetTaskByIdHandler(ITaskRepository repository) : IQueryHandler<GetTaskByIdQuery, TaskResponse>
{
    public async Task<Result<TaskResponse>> Handle(GetTaskByIdQuery query, CancellationToken ct)
    {
        var task = await repository.GetByIdAsync(query.Id, query.UserId);
        if (task is null)
            return Result.Fail<TaskResponse>("Task not found.");

        return Result.Ok(task.Adapt<TaskResponse>());
    }
}
