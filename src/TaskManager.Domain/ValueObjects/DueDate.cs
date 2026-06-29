using FluentResults;
using TaskManager.Domain.Interfaces;

namespace TaskManager.Domain.ValueObjects;

public sealed class DueDate
{
    public DateTime Value { get; private set; }

    private DueDate() { }

    private DueDate(DateTime value)
    {
        Value = value;
    }

    public static Result<DueDate> Create(DateTime dueDate, IDateTimeProvider dateTimeProvider)
    {
        if (dueDate.Date < dateTimeProvider.UtcNow.Date)
            return Result.Fail("Due date must be in the future.");

        return Result.Ok(new DueDate(dueDate));
    }

    public override bool Equals(object? obj) => obj is DueDate other && Value == other.Value;
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value.ToString("yyyy-MM-dd");

    public static implicit operator DateTime(DueDate dueDate) => dueDate.Value;
}
