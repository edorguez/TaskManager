using FluentValidation;

namespace TaskManager.Application.Tasks.Commands;

public class UpdateTaskValidator : AbstractValidator<UpdateTaskCommand>
{
    public UpdateTaskValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.DueDate).NotEmpty();
        RuleFor(x => x.StatusId).InclusiveBetween(1, 3);
    }
}
