namespace TaskManager.Contracts.Tasks;

public record TaskResponse(Guid Id, string Title, string Description, string Status, DateTime DueDate, DateTime CreatedAt, DateTime? UpdatedAt);
