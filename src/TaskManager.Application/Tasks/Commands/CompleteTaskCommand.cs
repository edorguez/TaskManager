using TaskManager.Application.Abstractions.Mediator;

namespace TaskManager.Application.Tasks.Commands;

public record CompleteTaskCommand(Guid Id, string UserId) : ICommand;
