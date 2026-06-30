using FluentValidation.TestHelper;
using TaskManager.Application.Tasks.Commands;

namespace TaskManager.Tests.Application;

public class UpdateTaskValidatorTests
{
    private readonly UpdateTaskValidator _validator = new();

    [Fact]
    public void Validate_WithValidCommand_ShouldNotHaveErrors()
    {
        var command = new UpdateTaskCommand(Guid.NewGuid(), "Valid Title", "Description", DateTime.UtcNow.AddDays(1), 1, "user-1");

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyId_ShouldHaveError()
    {
        var command = new UpdateTaskCommand(Guid.Empty, "Title", "Description", DateTime.UtcNow.AddDays(1), 1, "user-1");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Id);
    }

    [Fact]
    public void Validate_WithEmptyTitle_ShouldHaveError()
    {
        var command = new UpdateTaskCommand(Guid.NewGuid(), "", "Description", DateTime.UtcNow.AddDays(1), 1, "user-1");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_WithInvalidStatusId_ShouldHaveError()
    {
        var command = new UpdateTaskCommand(Guid.NewGuid(), "Title", "Description", DateTime.UtcNow.AddDays(1), 0, "user-1");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.StatusId);
    }
}
