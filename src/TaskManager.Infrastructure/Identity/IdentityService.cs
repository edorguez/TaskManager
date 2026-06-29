using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FluentResults;
using Microsoft.AspNetCore.Identity;
using TaskManager.Contracts.Auth;

namespace TaskManager.Infrastructure.Identity;

public class IdentityService(UserManager<ApplicationUser> userManager, JwtTokenService jwtTokenService)
{
    public async Task<Result<AuthResponse>> RegisterAsync(string email, string password, string confirmPassword)
    {
        if (password != confirmPassword)
            return Result.Fail<AuthResponse>("Passwords do not match.");

        var existingUser = await userManager.FindByEmailAsync(email);
        if (existingUser is not null)
            return Result.Fail<AuthResponse>("Email is already registered.");

        var user = new ApplicationUser { UserName = email, Email = email };
        var result = await userManager.CreateAsync(user, password);

        if (!result.Succeeded)
            return Result.Fail<AuthResponse>(result.Errors.Select(e => e.Description));

        var (token, expiresAt) = jwtTokenService.GenerateToken(user);
        return Result.Ok(new AuthResponse(token, email, expiresAt));
    }

    public async Task<Result<AuthResponse>> LoginAsync(string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return Result.Fail<AuthResponse>("Invalid email or password.");

        var validPassword = await userManager.CheckPasswordAsync(user, password);
        if (!validPassword)
            return Result.Fail<AuthResponse>("Invalid email or password.");

        var (token, expiresAt) = jwtTokenService.GenerateToken(user);
        return Result.Ok(new AuthResponse(token, email, expiresAt));
    }

    public async Task<Result<AuthResponse>> GetCurrentUserAsync(ClaimsPrincipal principal)
    {
        var user = await userManager.GetUserAsync(principal);
        if (user is null)
            return Result.Fail<AuthResponse>("User not found.");

        var (token, expiresAt) = jwtTokenService.GenerateToken(user);
        return Result.Ok(new AuthResponse(token, user.Email ?? string.Empty, expiresAt));
    }
}
