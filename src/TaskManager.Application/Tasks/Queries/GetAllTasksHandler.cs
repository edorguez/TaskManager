using FluentResults;
using Mapster;
using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Contracts.Tasks;
using TaskManager.Domain.Interfaces;

namespace TaskManager.Application.Tasks.Queries;

public class GetAllTasksHandler(ITaskRepository repository) : IQueryHandler<GetAllTasksQuery, IEnumerable<TaskResponse>>
{
    public async Task<Result<IEnumerable<TaskResponse>>> Handle(GetAllTasksQuery query, CancellationToken ct)
    {
        var tasks = await repository.GetAllByUserAsync(query.UserId);
        var response = tasks.Adapt<IEnumerable<TaskResponse>>();
        return Result.Ok(response);
    }
}
