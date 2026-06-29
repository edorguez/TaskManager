using TaskManager.Domain.Common;

namespace TaskManager.Domain.Events;

public sealed record TaskCreatedDomainEvent(Guid TaskId, string CreatedByUserId) : BaseDomainEvent;
