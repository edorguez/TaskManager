using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Contracts.Tasks;

namespace TaskManager.Application.Tasks.Queries;

public record GetAllTasksQuery(string UserId) : IQuery<IEnumerable<TaskResponse>>;
