using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Contracts.Tasks;

namespace TaskManager.Application.Tasks.Queries;

public record GetTaskByIdQuery(Guid Id, string UserId) : IQuery<TaskResponse>;
