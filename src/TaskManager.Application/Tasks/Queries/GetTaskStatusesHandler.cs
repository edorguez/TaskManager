using FluentResults;
using Mapster;
using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Contracts.Tasks;

namespace TaskManager.Application.Tasks.Queries;

public class GetTaskStatusesHandler : IQueryHandler<GetTaskStatusesQuery, IEnumerable<TaskStatusResponse>>
{
    public async Task<Result<IEnumerable<TaskStatusResponse>>> Handle(GetTaskStatusesQuery query, CancellationToken ct)
    {
        var statuses = new List<Domain.Entities.TaskStatus>
        {
            new() { Id = 1, Name = "Todo" },
            new() { Id = 2, Name = "InProgress" },
            new() { Id = 3, Name = "Done" }
        };
        return Result.Ok(statuses.Adapt<IEnumerable<TaskStatusResponse>>());
    }
}
