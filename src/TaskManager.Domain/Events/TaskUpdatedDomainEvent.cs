using TaskManager.Domain.Common;

namespace TaskManager.Domain.Events;

public sealed record TaskUpdatedDomainEvent(Guid TaskId, string CreatedByUserId) : BaseDomainEvent;
