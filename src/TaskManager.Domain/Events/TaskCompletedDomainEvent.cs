using TaskManager.Domain.Common;

namespace TaskManager.Domain.Events;

public sealed record TaskCompletedDomainEvent(Guid TaskId, string CreatedByUserId) : BaseDomainEvent;
