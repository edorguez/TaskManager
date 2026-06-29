namespace TaskManager.Contracts.Common;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = [];
}

public class ApiResponse
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = [];

    public static ApiResponse<T> Ok<T>(T data) => new() { Success = true, Data = data };
    public static ApiResponse Fail(string error) => new() { Success = false, Errors = [error] };
    public static ApiResponse Fail(IEnumerable<string> errors) => new() { Success = false, Errors = errors.ToList() };
}
