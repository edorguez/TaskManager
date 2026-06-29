namespace TaskManager.Contracts.Tasks;

public record UpdateTaskRequest(string Title, string Description, DateTime DueDate, int StatusId);
