using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Abstractions.Mediator;
using TaskManager.Application.Tasks.Commands;
using TaskManager.Application.Tasks.Queries;
using TaskManager.Contracts.Common;
using TaskManager.Contracts.Tasks;
using System.Security.Claims;

namespace TaskManager.API.Endpoints;

public static class TaskEndpoints
{
    public static void MapTaskEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/tasks").WithTags("Tasks").RequireAuthorization();

        group.MapGet("/", async (IMediator mediator, HttpContext httpContext) =>
        {
            var userId = GetUserId(httpContext);
            var result = await mediator.Send(new GetAllTasksQuery(userId));
            if (result.IsFailed)
                return Results.BadRequest(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
            return Results.Ok(ApiResponse.Ok(result.Value));
        });

        group.MapGet("/{id:guid}", async (Guid id, IMediator mediator, HttpContext httpContext) =>
        {
            var userId = GetUserId(httpContext);
            var result = await mediator.Send(new GetTaskByIdQuery(id, userId));
            if (result.IsFailed)
                return Results.NotFound(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
            return Results.Ok(ApiResponse.Ok(result.Value));
        });

        group.MapPost("/", async ([FromBody] CreateTaskRequest request, IMediator mediator, HttpContext httpContext) =>
        {
            var userId = GetUserId(httpContext);
            var result = await mediator.Send(new CreateTaskCommand(request.Title, request.Description, request.DueDate, userId));
            if (result.IsFailed)
                return Results.BadRequest(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
            return Results.Created($"/api/tasks/{result.Value.Id}", ApiResponse.Ok(result.Value));
        });

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateTaskRequest request, IMediator mediator, HttpContext httpContext) =>
        {
            var userId = GetUserId(httpContext);
            var result = await mediator.Send(new UpdateTaskCommand(id, request.Title, request.Description, request.DueDate, request.StatusId, userId));
            if (result.IsFailed)
                return Results.BadRequest(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
            return Results.Ok(ApiResponse.Ok(result.Value));
        });

        group.MapDelete("/{id:guid}", async (Guid id, IMediator mediator, HttpContext httpContext) =>
        {
            var userId = GetUserId(httpContext);
            var result = await mediator.Send(new DeleteTaskCommand(id, userId));
            if (result.IsFailed)
                return Results.NotFound(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
            return Results.Ok(ApiResponse.Ok<object>(null!));
        });

        group.MapPatch("/{id:guid}/complete", async (Guid id, IMediator mediator, HttpContext httpContext) =>
        {
            var userId = GetUserId(httpContext);
            var result = await mediator.Send(new CompleteTaskCommand(id, userId));
            if (result.IsFailed)
                return Results.BadRequest(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
            return Results.Ok(ApiResponse.Ok<object>(null!));
        });

        group.MapGet("/statuses", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetTaskStatusesQuery());
            if (result.IsFailed)
                return Results.BadRequest(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
            return Results.Ok(ApiResponse.Ok(result.Value));
        });
    }

    private static string GetUserId(HttpContext httpContext)
    {
        return httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User not authenticated");
    }
}
