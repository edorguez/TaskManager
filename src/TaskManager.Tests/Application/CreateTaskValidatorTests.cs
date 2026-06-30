using FluentValidation.TestHelper;
using TaskManager.Application.Tasks.Commands;

namespace TaskManager.Tests.Application;

public class CreateTaskValidatorTests
{
    private readonly CreateTaskValidator _validator = new();

    [Fact]
    public void Validate_WithValidCommand_ShouldNotHaveErrors()
    {
        var command = new CreateTaskCommand("Valid Title", "Description", DateTime.UtcNow.AddDays(1), 1, "user-1");

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyTitle_ShouldHaveError()
    {
        var command = new CreateTaskCommand("", "Description", DateTime.UtcNow.AddDays(1), 1, "user-1");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_WithTitleExceedingMaxLength_ShouldHaveError()
    {
        var command = new CreateTaskCommand(new string('a', 201), "Description", DateTime.UtcNow.AddDays(1), 1, "user-1");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_WithInvalidStatusId_ShouldHaveError()
    {
        var command = new CreateTaskCommand("Title", "Description", DateTime.UtcNow.AddDays(1), 0, "user-1");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.StatusId);
    }

    [Fact]
    public void Validate_WithStatusIdAboveMax_ShouldHaveError()
    {
        var command = new CreateTaskCommand("Title", "Description", DateTime.UtcNow.AddDays(1), 4, "user-1");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.StatusId);
    }
}
