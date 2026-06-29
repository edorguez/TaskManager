namespace TaskManager.Domain.Common;

public abstract record BaseDomainEvent : IDomainEvent
{
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}
