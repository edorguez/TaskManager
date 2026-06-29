namespace TaskManager.Contracts.Auth;

public record AuthResponse(string Token, string Email, DateTime ExpiresAt);
