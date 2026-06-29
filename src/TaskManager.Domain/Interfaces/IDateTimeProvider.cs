namespace TaskManager.Domain.Interfaces;

public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
}
