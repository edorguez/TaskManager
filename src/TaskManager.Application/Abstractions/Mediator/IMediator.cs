using FluentResults;

namespace TaskManager.Application.Abstractions.Mediator;

public interface IMediator
{
    Task<Result> Send(ICommand command, CancellationToken ct = default);
    Task<Result<T>> Send<T>(ICommand<T> command, CancellationToken ct = default);
    Task<Result<T>> Send<T>(IQuery<T> query, CancellationToken ct = default);
}
