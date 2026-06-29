using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Contracts.Tasks;

namespace TaskManager.Application.Tasks.Commands;

public record CreateTaskCommand(string Title, string Description, DateTime DueDate, string UserId) : ICommand<TaskResponse>;
