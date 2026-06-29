using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Contracts.Tasks;

namespace TaskManager.Application.Tasks.Queries;

public record GetTaskStatusesQuery : IQuery<IEnumerable<TaskStatusResponse>>;
