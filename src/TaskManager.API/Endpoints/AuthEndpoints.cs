using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Contracts.Auth;
using TaskManager.Contracts.Common;
using TaskManager.Infrastructure.Identity;

namespace TaskManager.API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/register", async ([FromBody] RegisterRequest request, IdentityService identityService) =>
        {
            var result = await identityService.RegisterAsync(request.Email, request.Password, request.ConfirmPassword);
            if (result.IsFailed)
                return Results.BadRequest(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
            return Results.Ok(ApiResponse.Ok(result.Value));
        });

        group.MapPost("/login", async ([FromBody] LoginRequest request, IdentityService identityService) =>
        {
            var result = await identityService.LoginAsync(request.Email, request.Password);
            if (result.IsFailed)
                return Results.BadRequest(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
            return Results.Ok(ApiResponse.Ok(result.Value));
        });

        group.MapGet("/me", async (HttpContext httpContext, IdentityService identityService) =>
        {
            var result = await identityService.GetCurrentUserAsync(httpContext.User);
            if (result.IsFailed)
                return Results.Unauthorized();
            return Results.Ok(ApiResponse.Ok(result.Value));
        }).RequireAuthorization();
    }
}
