using TaskManager.Application.Abstractions.Mediator;

namespace TaskManager.Application.Tasks.Commands;

public record DeleteTaskCommand(Guid Id, string UserId) : ICommand;
