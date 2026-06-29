using System.Collections.Concurrent;
using FluentResults;
using Microsoft.Extensions.DependencyInjection;

namespace TaskManager.Application.Abstractions.Mediator;

public sealed class Mediator : IMediator
{
    private readonly IServiceProvider _serviceProvider;
    private static readonly ConcurrentDictionary<Type, object> _handlerFactories = new();

    public Mediator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task<Result> Send(ICommand command, CancellationToken ct = default)
    {
        var handlerType = typeof(ICommandHandler<>).MakeGenericType(command.GetType());
        var handler = _serviceProvider.GetRequiredService(handlerType);
        var method = handlerType.GetMethod("Handle")!;
        var result = await (Task<Result>)method.Invoke(handler, [command, ct])!;
        return result;
    }

    public async Task<Result<T>> Send<T>(ICommand<T> command, CancellationToken ct = default)
    {
        var handlerType = typeof(ICommandHandler<,>).MakeGenericType(command.GetType(), typeof(T));
        var handler = _serviceProvider.GetRequiredService(handlerType);
        var method = handlerType.GetMethod("Handle")!;
        var result = await (Task<Result<T>>)method.Invoke(handler, [command, ct])!;
        return result;
    }

    public async Task<Result<T>> Send<T>(IQuery<T> query, CancellationToken ct = default)
    {
        var handlerType = typeof(IQueryHandler<,>).MakeGenericType(query.GetType(), typeof(T));
        var handler = _serviceProvider.GetRequiredService(handlerType);
        var method = handlerType.GetMethod("Handle")!;
        var result = await (Task<Result<T>>)method.Invoke(handler, [query, ct])!;
        return result;
    }
}
