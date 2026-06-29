namespace TaskManager.Contracts.Tasks;

public record CreateTaskRequest(string Title, string Description, DateTime DueDate);
