using FluentResults;

namespace TaskManager.Domain.ValueObjects;

public sealed class TaskTitle
{
    public string Value { get; private set; }

    private TaskTitle() { }

    private TaskTitle(string value)
    {
        Value = value;
    }

    public static Result<TaskTitle> Create(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return Result.Fail("Title cannot be empty.");
        if (title.Length > 200)
            return Result.Fail("Title cannot exceed 200 characters.");

        return Result.Ok(new TaskTitle(title.Trim()));
    }

    public override bool Equals(object? obj) => obj is TaskTitle other && Value == other.Value;
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value;

    public static implicit operator string(TaskTitle title) => title.Value;
}
