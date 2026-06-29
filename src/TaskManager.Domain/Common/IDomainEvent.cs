namespace TaskManager.Domain.Common;

public interface IDomainEvent
{
    DateTime OccurredOn { get; }
}
