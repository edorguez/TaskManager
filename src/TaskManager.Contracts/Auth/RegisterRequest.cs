namespace TaskManager.Contracts.Auth;

public record RegisterRequest(string Email, string Password, string ConfirmPassword);
