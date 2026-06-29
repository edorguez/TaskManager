using FluentResults;
using FluentValidation;
using TaskManager.Application.Abstractions.Mediator;

namespace TaskManager.Application.Abstractions.Behaviors;

public sealed class ValidationBehavior<TCommand>(IValidator<TCommand>? validator = null) : ICommandHandler<TCommand>
    where TCommand : ICommand
{
    public async Task<Result> Handle(TCommand command, CancellationToken ct)
    {
        if (validator is not null)
        {
            var validationResult = await validator.ValidateAsync(command, ct);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return Result.Fail(errors);
            }
        }

        return Result.Ok();
    }
}
