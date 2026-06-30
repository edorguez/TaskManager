# TaskManager — Technical Specification

> **Project:** TaskManager  
> **Date:** 2026-06-28  
> **Backend:** .NET 10 + PostgreSQL + EF Core  
> **Frontend:** React 19 + TypeScript 6 + Material UI 9  
> **Architecture:** Clean Architecture + Domain-Driven Design (DDD)  
> **Containerization:** Docker + docker-compose  

---

## 1. Executive Summary

TaskManager is a full-stack task management application built as a technical interview exercise. It demonstrates Clean Architecture, Domain-Driven Design, CQRS via a custom in-house mediator, Test-Driven Development, and modern full-stack development practices.

The application allows authenticated users to create, read, update, and delete their own tasks. Each task has a title, description, status (Todo / InProgress / Done), and due date. Tasks are strictly scoped to their creator — users can only see and manage their own data.

---

## 2. Architecture

### 2.1 Clean Architecture Dependency Flow

```
┌─────────────────────────────────────────────────────────────┐
│  TaskManager.API          ← Minimal APIs, Auth, OpenAPI     │
├─────────────────────────────────────────────────────────────┤
│  TaskManager.Contracts    ← DTOs shared across layers       │
├─────────────────────────────────────────────────────────────┤
│  TaskManager.Application  ← Custom Mediator, CQRS Handlers  │
├─────────────────────────────────────────────────────────────┤
│  TaskManager.Domain       ← Entities, VO, Events, Interfaces│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  TaskManager.Infrastructure ← EF Core, Identity, PostgreSQL  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Dependency Rule

Dependencies point **inward only**:

| Project | References |
|---------|-----------|
| `Domain` | None (zero external dependencies) |
| `Contracts` | None (plain DTOs) |
| `Application` | Domain, Contracts |
| `Infrastructure` | Application |
| `API` | Application, Infrastructure |
| `Tests` | Domain, Application, API |

The Domain layer has no dependency on EF Core, HTTP, JSON, or any external framework.

---

## 3. Decision Log

| # | Decision | Choice |
|---|----------|--------|
| 1 | Mediator / CQRS | **Custom In-House Mediator** (no MediatR dependency) |
| 2 | Domain / Application Idea | **Task Management System** |
| 3 | .NET Version | **.NET 10** (preview, released 2026) |
| 4 | API Style | **Native Minimal APIs + Built-in OpenAPI** (no controllers, no Carter) |
| 5 | Database | **PostgreSQL + EF Core 10 preview** |
| 6 | Authentication | **ASP.NET Core Identity + JWT Bearer Tokens** |
| 7 | Frontend Stack | React 19 + TypeScript 6 + MUI 9 + SCSS + Zustand 5 + Axios + React Router v7 |
| 8 | Testing | **xUnit + NSubstitute + FluentAssertions** (unit tests: Domain + Application + API) |
| 9 | Domain Model | **Rich Domain Model** (aggregates, value objects, domain events) |
| 10 | Docker | **Backend + Frontend + PostgreSQL** in docker-compose |
| 11 | Solution File | **.slnx** (new XML format, VS 2022+ / .NET 9+) |
| 12 | GenAI Tool | **OpenCode with Deepseek models** |
| 13 | Task Status | **Simple 3-state:** `Todo`, `InProgress`, `Done` |
| 14 | User Roles | **No roles** — any authenticated user can CRUD their own tasks only |
| 15 | Task Assignment | **Tasks are created BY a user (creator/owner)** — strict user-scoping |
| 16 | Frontend Pages | Login, Register, Dashboard, Task List, Task Create/Edit, 404 |
| 17 | Seeded Data | **TaskStatus lookup rows only** (seeded via `HasData()`) |
| 18 | Validation / Errors | **FluentResults everywhere** — handlers return `Result<T>`, never throw |
| 19 | API Response Format | **Envelope/Wrapper** — `{ success, data, errors }` |
| 20 | API Docs UI | **Built-in .NET 10 OpenAPI + Scalar** (no Swashbuckle) |

---

## 4. Solution Structure

```
TaskManager/
├── TaskManager.slnx
├── docker-compose.yml
├── .env.example
├── .env                              ← gitignored
├── .gitignore
├── .dockerignore
├── src/
│   ├── TaskManager.Domain/
│   │   ├── Common/
│   │   │   ├── AggregateRoot.cs
│   │   │   ├── BaseDomainEvent.cs
│   │   │   └── IDomainEvent.cs
│   │   ├── Entities/
│   │   │   ├── TaskItem.cs
│   │   │   └── TaskStatus.cs
│   │   ├── Events/
│   │   │   ├── TaskCreatedDomainEvent.cs
│   │   │   └── TaskUpdatedDomainEvent.cs
│   │   ├── Interfaces/
│   │   │   ├── IDateTimeProvider.cs
│   │   │   ├── ITaskRepository.cs
│   │   │   └── IUnitOfWork.cs
│   │   ├── ValueObjects/
│   │   │   ├── DueDate.cs
│   │   │   └── TaskTitle.cs
│   │   └── TaskManager.Domain.csproj
│   │
│   ├── TaskManager.Contracts/
│   │   ├── Auth/
│   │   │   ├── AuthResponse.cs
│   │   │   ├── LoginRequest.cs
│   │   │   └── RegisterRequest.cs
│   │   ├── Common/
│   │   │   └── ApiResponse.cs
│   │   ├── Tasks/
│   │   │   ├── CreateTaskRequest.cs
│   │   │   ├── TaskResponse.cs
│   │   │   ├── TaskStatusResponse.cs
│   │   │   └── UpdateTaskRequest.cs
│   │   └── TaskManager.Contracts.csproj
│   │
│   ├── TaskManager.Application/
│   │   ├── Abstractions/
│   │   │   ├── Behaviors/
│   │   │   │   └── ValidationBehavior.cs
│   │   │   └── Mediator/
│   │   │       ├── ICommand.cs
│   │   │       ├── ICommandHandler.cs
│   │   │       ├── IMediator.cs
│   │   │       └── Mediator.cs
│   │   ├── Mapping/
│   │   │   └── MappingProfile.cs
│   │   ├── Tasks/
│   │   │   ├── Commands/
│   │   │   │   ├── CreateTaskCommand.cs
│   │   │   │   ├── CreateTaskHandler.cs
│   │   │   │   ├── CreateTaskValidator.cs
│   │   │   │   ├── DeleteTaskCommand.cs
│   │   │   │   ├── DeleteTaskHandler.cs
│   │   │   │   ├── UpdateTaskCommand.cs
│   │   │   │   ├── UpdateTaskHandler.cs
│   │   │   │   └── UpdateTaskValidator.cs
│   │   │   └── Queries/
│   │   │       ├── GetAllTasksHandler.cs
│   │   │       ├── GetAllTasksQuery.cs
│   │   │       ├── GetTaskByIdHandler.cs
│   │   │       ├── GetTaskByIdQuery.cs
│   │   │       ├── GetTaskStatusesHandler.cs
│   │   │       └── GetTaskStatusesQuery.cs
│   │   ├── DependencyInjection.cs
│   │   └── TaskManager.Application.csproj
│   │
│   ├── TaskManager.Infrastructure/
│   │   ├── Data/
│   │   │   ├── Configurations/
│   │   │   │   ├── TaskItemConfiguration.cs
│   │   │   │   └── TaskStatusConfiguration.cs
│   │   │   ├── ApplicationDbContext.cs
│   │   │   └── UnitOfWork.cs
│   │   ├── Identity/
│   │   │   ├── ApplicationUser.cs
│   │   │   ├── IdentityService.cs
│   │   │   └── JwtTokenService.cs
│   │   ├── Repositories/
│   │   │   └── TaskRepository.cs
│   │   ├── Services/
│   │   │   └── DateTimeProvider.cs
│   │   ├── Settings/
│   │   │   └── JwtSettings.cs
│   │   ├── DependencyInjection.cs
│   │   └── TaskManager.Infrastructure.csproj
│   │
│   ├── TaskManager.API/
│   │   ├── Endpoints/
│   │   │   ├── AuthEndpoints.cs
│   │   │   └── TaskEndpoints.cs
│   │   ├── Middleware/
│   │   │   └── ErrorHandlingMiddleware.cs
│   │   ├── Properties/
│   │   │   └── launchSettings.json
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── Dockerfile
│   │   ├── Program.cs
│   │   └── TaskManager.API.csproj
│   │
│   └── TaskManager.Tests/
│       ├── API/
│       │   └── TaskEndpointsTests.cs
│       ├── Application/
│       │   ├── CreateTaskHandlerTests.cs
│       │   ├── GetAllTasksHandlerTests.cs
│       │   └── UpdateTaskHandlerTests.cs
│       ├── Domain/
│       │   ├── DueDateTests.cs
│       │   ├── TaskItemTests.cs
│       │   ├── TaskStatusTests.cs
│       │   └── TaskTitleTests.cs
│       ├── TaskManager.Tests.csproj
│       └── Usings.cs
│
└── frontend/
    └── taskmanager-web/
        ├── public/
        │   ├── favicon.svg
        │   └── icons.svg
        ├── src/
        │   ├── api/
        │   │   ├── auth.ts
        │   │   ├── client.ts
        │   │   └── tasks.ts
        │   ├── components/
        │   │   ├── Layout.tsx
        │   │   ├── ProtectedRoute.tsx
        │   │   ├── TaskCard.tsx
        │   │   └── TaskForm.tsx
        │   ├── pages/
        │   │   ├── DashboardPage.tsx
        │   │   ├── LoginPage.tsx
        │   │   ├── NotFoundPage.tsx
        │   │   ├── RegisterPage.tsx
        │   │   ├── TaskCreatePage.tsx
        │   │   ├── TaskEditPage.tsx
        │   │   └── TaskListPage.tsx
        │   ├── store/
        │   │   ├── authStore.ts
        │   │   └── taskStore.ts
        │   ├── theme/
        │   │   └── theme.ts
        │   ├── types/
        │   │   └── index.ts
        │   ├── App.tsx
        │   ├── main.tsx
        │   ├── styles.scss
        │   └── vite-env.d.ts
        ├── .gitignore
        ├── Dockerfile
        ├── index.html
        ├── nginx.conf
        ├── package.json
        ├── vite.config.ts
        ├── tsconfig.json
        ├── tsconfig.app.json
        └── tsconfig.node.json
```

**Total: ~95 files** across all projects.

---

## 5. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | .NET SDK | 10.0 (preview) |
| API Style | Native Minimal APIs | Built-in |
| API Docs | OpenAPI (built-in) + Scalar | Scalar 2.16.6 |
| Mediator | **Custom In-House** | — |
| ORM | Entity Framework Core | 10.0.0-preview.1.25081.2 |
| Database | PostgreSQL (via Npgsql) | 16 |
| Auth | ASP.NET Core Identity + JWT Bearer | 10.0.0-preview.1.25081.2 |
| Validation | FluentValidation | 12.1.1 |
| Results | FluentResults | 4.0.0 |
| Mapping | Mapster | 10.0.9 |
| Testing | xUnit + NSubstitute + FluentAssertions | 2.9.3 / 5.3.0 / 8.10.0 |
| Test SDK | Microsoft.NET.Test.Sdk | 17.13.0 |
| Frontend | React | 19.2.7 |
| Frontend Lang | TypeScript | 6.0.2 |
| UI Library | Material UI (MUI) | 9.1.2 |
| Icons | MUI Icons | 9.1.1 |
| Styling | SCSS + MUI sx prop | sass 1.101.0 |
| State | Zustand | 5.0.14 |
| HTTP Client | Axios | 1.18.1 |
| Routing | React Router | 7.18.0 |
| Bundler | Vite | 6.4.3 |
| Linting | oxlint | 1.69.0 |
| Container | Docker + docker-compose | Latest |
| Node (Docker build) | Node | 22 (Alpine) |
| nginx (Docker runtime) | nginx | Alpine |

---

## 6. Domain Layer (`TaskManager.Domain`)

The Domain layer has **zero external dependencies** beyond `FluentResults` (for `Result<T>` return types). It contains the core business logic.

### 6.1 Common Base Classes

#### `AggregateRoot`
Base class for aggregate roots. Maintains a list of `IDomainEvent` for event dispatching via `IUnitOfWork`.

```
Fields:
- _domainEvents: List<IDomainEvent>

Methods:
- RaiseDomainEvent(IDomainEvent)
- ClearDomainEvents()
- IReadOnlyCollection<IDomainEvent> DomainEvents { get; }
```

#### `IDomainEvent`
Empty marker interface for domain events.

#### `BaseDomainEvent`
Abstract base implementing `IDomainEvent`.

### 6.2 Entities

#### `TaskItem` (Aggregate Root)

```csharp
public class TaskItem : AggregateRoot
{
    public Guid Id { get; private set; }
    public TaskTitle Title { get; private set; }
    public string Description { get; private set; }
    public int StatusId { get; private set; }
    public TaskStatus Status { get; private set; }
    public DueDate DueDate { get; private set; }
    public string CreatedByUserId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
}
```

**Factory method — `Create`:**
- Validates all value objects via constructor
- Sets initial status to `Todo` (StatusId = 1)
- Raises `TaskCreatedDomainEvent`
- Returns `Result<TaskItem>` (never throws)

**Behavior methods:**
- `Update(TaskTitle, string, DueDate)` — updates fields, raises `TaskUpdatedDomainEvent`
- `Start()` — transitions `Todo` → `InProgress`, fails if not `Todo`
- `ChangeStatus(int)` — transitions to any valid status (1-3), fails if invalid

**EF Core mapping:** Private parameterless constructor for EF Core. Value objects mapped via `OwnsOne`.

#### `TaskStatus` (Lookup Entity)

```csharp
public class TaskStatus
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```

Seeded rows: `(1, "Todo")`, `(2, "InProgress")`, `(3, "Done")`.

### 6.3 Value Objects

#### `TaskTitle`
- Wraps a `string Value`
- Validates: not null/empty, max 200 characters
- Immutable (private setter)
- Implicit equality via overridden `Equals`

#### `DueDate`
- Wraps a `DateTime Value`
- Validates: must be in the future (uses `IDateTimeProvider` for testability)
- Immutable (private setter)

### 6.4 Domain Events

| Event | Raised When | Payload |
|-------|-------------|---------|
| `TaskCreatedDomainEvent` | `TaskItem.Create()` | TaskId, CreatedByUserId |
| `TaskUpdatedDomainEvent` | `TaskItem.Update()` | TaskId, CreatedByUserId |


### 6.5 Repository Interfaces

```csharp
public interface ITaskRepository
{
    Task<TaskItem?> GetByIdAsync(Guid id, string userId);
    Task<IEnumerable<TaskItem>> GetAllByUserAsync(string userId);
    Task AddAsync(TaskItem task);
    void Update(TaskItem task);
    void Delete(TaskItem task);
}

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
}
```

---

## 7. Application Layer (`TaskManager.Application`)

### 7.1 Custom In-House Mediator

A lightweight mediator implementation using reflection, registered via `IServiceCollection`. No Scrutor, no MediatR dependency.

#### Interfaces

```csharp
public interface ICommand { }
public interface ICommand<TResponse> : ICommand { }
public interface IQuery<TResponse> { }

public interface ICommandHandler<in TCommand> where TCommand : ICommand
{
    Task<Result> Handle(TCommand command, CancellationToken ct);
}

public interface ICommandHandler<in TCommand, TResponse> where TCommand : ICommand<TResponse>
{
    Task<Result<TResponse>> Handle(TCommand command, CancellationToken ct);
}

public interface IQueryHandler<in TQuery, TResponse> where TQuery : IQuery<TResponse>
{
    Task<Result<TResponse>> Handle(TQuery query, CancellationToken ct);
}

public interface IMediator
{
    Task<Result> Send(ICommand command, CancellationToken ct = default);
    Task<Result<T>> Send<T>(ICommand<T> command, CancellationToken ct = default);
    Task<Result<T>> Send<T>(IQuery<T> query, CancellationToken ct = default);
}
```

#### Implementation (`Mediator`)

The `Mediator` class resolves handlers from `IServiceProvider` using reflection:
- Builds the closed generic handler type at runtime (e.g., `ICommandHandler<CreateTaskCommand, TaskDto>`)
- Resolves from DI container
- Invokes `Handle` via `MethodInfo.Invoke`

All commands/queries and their handlers are registered in `DependencyInjection.cs` via a startup scanner that iterates through assemblies.

#### Validation Pipeline (`ValidationBehavior<T>`)

A generic behavior that wraps handler execution:
1. Resolves `IValidator<T>` from DI (if registered)
2. Runs validation
3. If invalid, returns `Result.Fail(...)` with validation error messages (never throws)
4. If valid, proceeds to handler

### 7.2 CQRS Handlers

#### Commands

| Command | Handler | Validator | Description |
|---------|---------|-----------|-------------|
| `CreateTaskCommand` | `CreateTaskHandler` | `CreateTaskValidator` | Creates task via `TaskItem.Create()`, persists, maps to `TaskResponse` |
| `UpdateTaskCommand` | `UpdateTaskHandler` | `UpdateTaskValidator` | Fetches task, calls `Update()` + `ChangeStatus()`, persists |
| `DeleteTaskCommand` | `DeleteTaskHandler` | — | Fetches task, deletes |

#### Queries

| Query | Handler | Description |
|-------|---------|-------------|
| `GetAllTasksQuery` | `GetAllTasksHandler` | Returns all tasks for userId, mapped to `TaskDto` |
| `GetTaskByIdQuery` | `GetTaskByIdHandler` | Returns single task (userId-scoped) |
| `GetTaskStatusesQuery` | `GetTaskStatusesHandler` | Returns lookup statuses |

### 7.3 Mapping

Mapster `MappingProfile` defines:
- `TaskItem → TaskDto`
- `TaskStatus → TaskStatusDto`

Registered via `AddMapster()` in DI.

### 7.4 Dependency Injection Registration

```csharp
public static IServiceCollection AddApplication(this IServiceCollection services)
{
    services.AddMediator();           // Scans assemblies, registers handlers
    services.AddValidatorsFromAssemblyContaining<CreateTaskValidator>();
    services.AddMapster();
    // ...
}
```

---

## 8. Contracts Layer (`TaskManager.Contracts`)

Plain DTOs with no dependencies. Shared across layers for request/response serialization.

### 8.1 Response Envelope

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = [];
}

public class ApiResponse  // Non-generic helper
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = [];

    public static ApiResponse<T> Ok<T>(T data) => new() { Success = true, Data = data };
    public static ApiResponse Fail(string error) => new() { Success = false, Errors = [error] };
    public static ApiResponse Fail(IEnumerable<string> errors) => new() { Success = false, Errors = errors.ToList() };
}
```

### 8.2 Request DTOs

```csharp
public record RegisterRequest(string Email, string Password, string ConfirmPassword);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, string Email, DateTime ExpiresAt);
public record CreateTaskRequest(string Title, string Description, DateTime DueDate, int StatusId);
public record UpdateTaskRequest(string Title, string Description, DateTime DueDate, int StatusId);
public record TaskResponse(Guid Id, string Title, string Description, string Status, DateTime DueDate, DateTime CreatedAt, DateTime? UpdatedAt);
public record TaskStatusResponse(int Id, string Name);
```

---

## 9. Infrastructure Layer (`TaskManager.Infrastructure`)

### 9.1 Persistence

#### `ApplicationDbContext`
- Extends `IdentityDbContext<ApplicationUser>`
- Registers `TaskItem` and `TaskStatus` entity configurations
- Overrides `SaveChangesAsync` to dispatch domain events via `IUnitOfWork`

#### `TaskItemConfiguration` (EF Core Fluent API)
- Table: `TaskItems`
- Key: `Id` (no auto-generation — set by domain)
- OwnsOne: `Title` → column `Title` (max 200, required)
- Property: `Description` (max 2000)
- Property: `StatusId` (required, FK → `TaskStatuses`)
- Property: `CreatedByUserId` (max 450, indexed)
- Property: `CreatedAt`, `UpdatedAt`
- Ignored: `DomainEvents` (not persisted)
- Relationship: `HasOne(x => x.Status).WithMany().HasForeignKey(x => x.StatusId)`

#### `TaskStatusConfiguration` (EF Core Fluent API)
- Table: `TaskStatuses`
- Key: `Id`
- Seed: `HasData()` with 3 rows

#### `UnitOfWork`
- Wraps `ApplicationDbContext`
- `SaveChangesAsync`: saves changes to the database

### 9.2 Identity

#### `ApplicationUser`
- Extends `IdentityUser` (no additional properties)

#### `IdentityService`
- `RegisterAsync(email, password, confirmPassword)` — creates user, returns `Result<AuthResponse>`
- `LoginAsync(email, password)` — validates credentials, returns `Result<AuthResponse>` with JWT
- `GetCurrentUserAsync(ClaimsPrincipal)` — returns `Result<AuthResponse>` from claims

#### `JwtTokenService`
- Generates JWT with: `sub` (userId), `email`, `iat`, `exp`
- Reads secret/issuer/audience from `JwtSettings` (bound from `appsettings.json` / environment variables)
- `exp` is set to 24 hours from generation (hardcoded)

### 9.3 Repositories

#### `TaskRepository`
- Implements `ITaskRepository`
- All queries filtered by `CreatedByUserId` — user-scoping enforced at data layer
- Uses `ApplicationDbContext` directly

### 9.4 Services

#### `DateTimeProvider`
- Implements `IDateTimeProvider`
- `UtcNow` → `DateTime.UtcNow`

### 9.5 Configuration

`JwtSettings` bound from `Jwt__*` config keys:
```json
{
  "Jwt": {
    "Secret": "your_super_secret_jwt_key_min_32_chars_long_here",
    "Issuer": "TaskManagerAPI",
    "Audience": "TaskManagerWeb",
    "ExpirationInMinutes": 60
  }
}
```

---

## 10. API Layer (`TaskManager.API`)

### 10.1 Program.cs

```csharp
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddOpenApi();
builder.Services.AddCors(...);

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseCors("AllowFrontend");
app.MapOpenApi();
app.MapScalarApiReference(options => { ... });
app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();
app.MapTaskEndpoints();
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy" }));

if (!app.Environment.IsEnvironment("Testing"))
    db.Database.Migrate();
```

### 10.2 Endpoints

#### Auth Endpoints (`AuthEndpoints.cs`)

| Method | Path | Auth | Handler |
|--------|------|------|---------|
| POST | `/api/auth/register` | No | `IdentityService.RegisterAsync` |
| POST | `/api/auth/login` | No | `IdentityService.LoginAsync` |
| GET | `/api/auth/me` | Yes | `IdentityService.GetCurrentUserAsync` |

#### Task Endpoints (`TaskEndpoints.cs`)

| Method | Path | Auth | Handler | Description |
|--------|------|------|---------|-------------|
| GET | `/api/tasks` | Yes | `GetAllTasksHandler` | List user's tasks |
| GET | `/api/tasks/{id:guid}` | Yes | `GetTaskByIdHandler` | Get single task |
| POST | `/api/tasks` | Yes | `CreateTaskHandler` | Create task |
| PUT | `/api/tasks/{id:guid}` | Yes | `UpdateTaskHandler` | Update task |
| DELETE | `/api/tasks/{id:guid}` | Yes | `DeleteTaskHandler` | Delete task |
| GET | `/api/tasks/statuses` | Yes | `GetTaskStatusesHandler` | List statuses |

All task endpoints extract `UserId` from `ClaimsPrincipal` via `ClaimTypes.NameIdentifier` and pass it to handlers.

### 10.3 Response Envelope Usage

```csharp
// Success
return Results.Ok(ApiResponse.Ok(data));

// Failure (validation, not found, etc.)
return Results.BadRequest(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
return Results.NotFound(ApiResponse.Fail(result.Errors.Select(e => e.Message)));
```

### 10.4 Middleware

#### `ErrorHandlingMiddleware`
- Catches unhandled exceptions
- Returns `500` with envelope format: `{ success: false, data: null, errors: ["An internal server error occurred."] }`
- Logs the exception via `ILogger<ErrorHandlingMiddleware>`

### 10.5 OpenAPI / Scalar

- `.NET 10` built-in `Microsoft.AspNetCore.OpenApi`
- `Scalar.AspNetCore` package for interactive UI
- Configured in development only
- Theme: Purple
- Default HTTP client: C# / HttpClient
- JWT Bearer auth scheme configured in OpenAPI document

### 10.6 CORS

- Policy name: `AllowFrontend`
- Origin: configurable via `FrontendUrl` config key (default `http://localhost:3000`)
- Allows any header, any method, credentials

---

## 11. Testing Layer (`TaskManager.Tests`)

### 11.1 Project Structure

```
src/TaskManager.Tests/
├── API/
│   └── TaskEndpointsTests.cs          # Endpoint mapping & auth tests
├── Application/
│   ├── CreateTaskHandlerTests.cs       # Handler unit tests
│   ├── GetAllTasksHandlerTests.cs
│   └── UpdateTaskHandlerTests.cs
├── Domain/
│   ├── DueDateTests.cs                 # Value object validation
│   ├── TaskItemTests.cs                # Entity behavior
│   ├── TaskStatusTests.cs
│   └── TaskTitleTests.cs               # Value object validation
├── TaskManager.Tests.csproj
└── Usings.cs
```

### 11.2 Testing Strategy

| Component | Approach | Tools |
|-----------|----------|-------|
| Domain | Pure unit tests — test value object validation, entity factory/behavior methods | xUnit + FluentAssertions |
| Application | Handler unit tests — mock `ITaskRepository`, `IUnitOfWork`, `IDateTimeProvider`, `IMapper` | xUnit + NSubstitute + FluentAssertions |
| API | Lightweight integration — `WebApplicationFactory` with in-memory DB | xUnit + FluentAssertions |

**What is NOT tested:**
- No integration tests (real DB)
- No frontend tests
- No architecture tests

### 11.3 Test Count Estimates

| Test Class | Test Count | What It Covers |
|-----------|-----------|----------------|
| `TaskTitleTests` | ~4 | Empty, null, max length, valid |
| `DueDateTests` | ~4 | Past date, future date, valid |
| `TaskItemTests` | ~9 | Create, update, start, change status, invalid transitions, domain events |
| `TaskStatusTests` | ~3 | Seeded values, immutability |
| `CreateTaskHandlerTests` | ~4 | Success, validation failure, repository error |
| `GetAllTasksHandlerTests` | ~3 | Success, empty list |
| `UpdateTaskHandlerTests` | ~4 | Success, not found, validation failure |
| `TaskEndpointsTests` | ~5 | Endpoint returns OK, auth required, not found |

---

## 12. Frontend (`frontend/taskmanager-web`)

### 12.1 Architecture

```
index.html → main.tsx → App.tsx
                          ├── /login      → LoginPage
                          ├── /register   → RegisterPage
                          ├── /           → ProtectedRoute → Layout → DashboardPage
                          ├── /tasks      → ProtectedRoute → Layout → TaskListPage
                          ├── /tasks/new  → ProtectedRoute → Layout → TaskCreatePage
                          ├── /tasks/:id/edit → ProtectedRoute → Layout → TaskEditPage
                          ├── /404        → NotFoundPage
                          └── *           → Navigate to /404
```

### 12.2 Routes & Pages

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/login` | `LoginPage` | No | Email/password form |
| `/register` | `RegisterPage` | No | Registration form |
| `/` | `DashboardPage` | Yes | Summary view |
| `/tasks` | `TaskListPage` | Yes | All tasks with filtering |
| `/tasks/new` | `TaskCreatePage` | Yes | Create task form |
| `/tasks/:id/edit` | `TaskEditPage` | Yes | Edit task form |
| `/404` | `NotFoundPage` | No | 404 catch-all |

### 12.3 State Management (Zustand)

#### `authStore`
```typescript
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;     // Persists to localStorage
  logout: () => void;                              // Clears localStorage
  initialize: () => void;                          // Rehydrates from localStorage on app mount
}
```

Persistence strategy: `token` and `user` stored in `localStorage`. On app mount, `initialize()` rehydrates state from storage.

#### `taskStore`
```typescript
interface TaskState {
  tasks: Task[];
  statuses: TaskStatus[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchStatuses: () => Promise<void>;
  createTask: (data: CreateTaskDto) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Promise<Task | null>;
}
```

All mutations update the local `tasks` array optimistically after the API call succeeds.

### 12.4 API Client (Axios)

`client.ts` creates a configured Axios instance:
- **Base URL:** `import.meta.env.VITE_API_URL` (default `http://localhost:8080`)
- **Request interceptor:** Injects `Authorization: Bearer <token>` from `authStore`
- **Response interceptor:** On 401, logs out and redirects to `/login`

Separate modules:
- `auth.ts` — `login()`, `register()`, `getMe()`
- `tasks.ts` — `getAll()`, `getById()`, `create()`, `update()`, `delete()`, `getStatuses()`

### 12.5 TypeScript Types

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string | null;
}

interface TaskStatus {
  id: number;
  name: string;
}

interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: string;
}

interface UpdateTaskDto {
  title: string;
  description: string;
  dueDate: string;
  statusId: number;
}

interface AuthResponse {
  token: string;
  email: string;
  expiresAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  errors: string[];
}

interface User {
  email: string;
}
```

### 12.6 UI Components

- **`Layout.tsx`** — AppShell: Sidebar (desktop left) + TopNavbar (desktop top) + `<Outlet />` + MobileNav (bottom mobile)
- **`ProtectedRoute.tsx`** — Redirects to `/login` if not authenticated
- **`Sidebar.tsx`** — Desktop nav with app title, NEW TASK link, Dashboard/Tasks nav items
- **`TopNavbar.tsx`** — User email badge + logout button
- **`MobileNav.tsx`** — Bottom nav with Dash, Tasks, Logout tabs
- **`ui/NeoButton.tsx`** — Styled button with 4px black border, hard shadow, hover/active transforms (4 variants)
- **`ui/NeoCard.tsx`** — Styled card with border + shadow + hover lift
- **`ui/NeoInput.tsx`** — Styled text field with focus animation
- **`ui/NeoModal.tsx`** — Full-screen backdrop modal with confirmation button
- **`ui/NeoChip.tsx`** — `StatusChip` for task status labels
- **`ui/StatCard.tsx`** — Dashboard stat card (label + value + icon)
- **`ui/SectionHeader.tsx`** — Section title + optional subtitle
- **`board/Board.tsx`** — Kanban board with 3 droppable columns and drag-and-drop via `@dnd-kit`
- **`board/Column.tsx`** — Single droppable column with sortable task cards
- **`board/BoardCard.tsx`** — Draggable task card with title, description, edit/delete actions

### 12.7 MUI Theme

Custom theme (`theme.ts`) with:
- Primary color: `#5e6300` (olive-green)
- Secondary: `#006e27` (green)
- Error: `#ba1a1a` (red)
- Background: `#fbf9f1` (off-white)
- Typography: Montserrat (headings), Space Grotesk (body), Space Mono (labels/buttons)
- All components have zero `borderRadius` (sharp brutalist edges)
- Component defaults: thick borders, hard drop-shadows on buttons/cards/modals

### 12.8 Production Build (Docker)

The `Dockerfile` builds the React app via multi-stage:
1. **Build stage** — `node:22-alpine`, `npm ci`, `npm run build` (TypeScript check + Vite build)
2. **Runtime stage** — `nginx:alpine` serving static files from `/usr/share/nginx/html`

`nginx.conf`:
- Serves static SPA files with fallback to `index.html` (for client-side routing)
- Proxies `/api/` requests to backend service at `http://api:8080`

---

## 13. Docker & DevOps

### 13.1 docker-compose Services

| Service | Image | Container Name | Port Mapping | Depends On |
|---------|-------|---------------|-------------|------------|
| `postgres` | `postgres:16-alpine` | `taskmanager-db` | `5432:5432` | — |
| `api` | Custom (Dockerfile) | `taskmanager-api` | `8080:8080` | postgres (healthy) |
| `frontend` | Custom (Dockerfile) | `taskmanager-web` | `3000:80` | api |

### 13.2 Dockerfiles

#### API (`src/TaskManager.API/Dockerfile`)
- **Build:** `mcr.microsoft.com/dotnet/sdk:10.0` — restores, publishes Release
- **Runtime:** `mcr.microsoft.com/dotnet/aspnet:10.0` — runs as `$APP_UID` (non-root)
- **Exposes:** 8080

#### Frontend (`frontend/taskmanager-web/Dockerfile`)
- **Build:** `node:22-alpine` — `npm ci`, `npm run build`
- **Runtime:** `nginx:alpine` — serves `dist/` with custom `nginx.conf`
- **Exposes:** 80

### 13.3 Health Checks

Postgres service uses `pg_isready` with 5 retries. API depends on `condition: service_healthy`, ensuring DB is ready before the API starts.

### 13.4 Network

All services are on the default docker-compose network. The frontend nginx proxies `/api/` to `http://api:8080` internally. The API connects to postgres at `host=postgres`.

---

## 14. Database Schema

```sql
-- TaskStatuses (lookup table, seeded)
CREATE TABLE "TaskStatuses" (
    "Id" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    CONSTRAINT "PK_TaskStatuses" PRIMARY KEY ("Id")
);

-- Seed data
INSERT INTO "TaskStatuses" ("Id", "Name") VALUES
    (1, 'Todo'),
    (2, 'InProgress'),
    (3, 'Done');

-- TaskItems (main entity)
CREATE TABLE "TaskItems" (
    "Id" UUID NOT NULL,
    "Title" VARCHAR(200) NOT NULL,
    "Description" TEXT NULL,
    "StatusId" INTEGER NOT NULL,
    "DueDate" TIMESTAMP NOT NULL,
    "CreatedByUserId" VARCHAR(450) NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL,
    "UpdatedAt" TIMESTAMP NULL,
    CONSTRAINT "PK_TaskItems" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TaskItems_TaskStatuses_StatusId" FOREIGN KEY ("StatusId")
        REFERENCES "TaskStatuses" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_TaskItems_CreatedByUserId" ON "TaskItems" ("CreatedByUserId");

-- AspNetUsers (ASP.NET Core Identity)
CREATE TABLE "AspNetUsers" (
    "Id" TEXT NOT NULL,
    "UserName" TEXT NULL,
    "NormalizedUserName" TEXT NULL,
    "Email" TEXT NULL,
    "NormalizedEmail" TEXT NULL,
    "EmailConfirmed" BOOLEAN NOT NULL,
    "PasswordHash" TEXT NULL,
    "SecurityStamp" TEXT NULL,
    "ConcurrencyStamp" TEXT NULL,
    "PhoneNumber" TEXT NULL,
    "PhoneNumberConfirmed" BOOLEAN NOT NULL,
    "TwoFactorEnabled" BOOLEAN NOT NULL,
    "LockoutEnd" TIMESTAMPTZ NULL,
    "LockoutEnabled" BOOLEAN NOT NULL,
    "AccessFailedCount" INTEGER NOT NULL,
    CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id")
);

-- Additional Identity tables (auto-generated by IdentityDbContext):
-- AspNetRoles, AspNetUserRoles, AspNetRoleClaims, AspNetUserClaims,
-- AspNetUserLogins, AspNetUserTokens
```

**Key design notes:**
- `TaskItems.Id` is a `UUID` set by the domain (not auto-generated by DB)
- `TaskItems.StatusId` is an `INT FK` to `TaskStatuses` (not an enum column)
- `TaskItems.CreatedByUserId` is indexed for user-scoped queries
- `Title` is stored in a `VARCHAR(200)` column via EF Core `OwnsOne`
- All Identity tables are auto-generated by `IdentityDbContext<ApplicationUser>`

---

## 15. API Specification

### 15.1 Common Response Envelope

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "errors": []
}
```

**Error (validation / business logic / not found):**
```json
{
  "success": false,
  "data": null,
  "errors": ["Title is required", "Due date must be in the future"]
}
```

**Server error (unhandled exception):**
```json
{
  "success": false,
  "data": null,
  "errors": ["Internal server error"]
}
```

### 15.2 Auth Endpoints

#### `POST /api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Str0ng!Pass",
  "confirmPassword": "Str0ng!Pass"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "email": "user@example.com",
    "expiresAt": "2026-06-28T13:00:00Z"
  },
  "errors": []
}
```

#### `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Str0ng!Pass"
}
```

**Response (200):** Same as register.

#### `GET /api/auth/me` (Requires Authorization)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "email": "user@example.com",
    "expiresAt": "2026-06-28T13:00:00Z"
  },
  "errors": []
}
```

### 15.3 Task Endpoints (All Require Authorization)

#### `GET /api/tasks`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Implement login",
      "description": "Add JWT auth to API",
      "status": "InProgress",
      "dueDate": "2026-07-05T00:00:00Z",
      "createdAt": "2026-06-28T10:00:00Z",
      "updatedAt": "2026-06-28T12:00:00Z"
    }
  ],
  "errors": []
}
```

#### `GET /api/tasks/{id}`

**Response (200):** Single task object.
**Response (404):** `{ success: false, data: null, errors: ["Task not found"] }`

#### `POST /api/tasks`

**Request:**
```json
{
  "title": "Implement login",
  "description": "Add JWT auth to API",
  "dueDate": "2026-07-05T00:00:00Z"
}
```

**Response (201):** Created task object.

#### `PUT /api/tasks/{id}`

**Request:**
```json
{
  "title": "Implement login",
  "description": "Add JWT auth to API with refresh tokens",
  "dueDate": "2026-07-10T00:00:00Z",
  "statusId": 2
}
```

**Response (200):** Updated task object.

#### `DELETE /api/tasks/{id}`

**Response (200):** `{ success: true, data: null, errors: [] }`
**Response (404):** `{ success: false, data: null, errors: ["Task not found"] }`

#### `GET /api/tasks/statuses`

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Todo" },
    { "id": 2, "name": "InProgress" },
    { "id": 3, "name": "Done" }
  ],
  "errors": []
}
```

---

## 16. User Story

> **As a** registered user,  
> **I want to** create, view, update, and delete my personal tasks,  
> **So that** I can organize my work and track my progress.

**Acceptance Criteria:**
- I can register and log in with email and password.
- I can create a task with a title, description, due date, and initial status (Todo).
- I can see only my own tasks on the dashboard and task list.
- I can update a task's title, description, due date, or status.
- I can delete a task permanently.
- I can filter or view tasks by status (Todo, In Progress, Done).
- Tasks have three statuses: Todo, In Progress, and Done.
- I cannot access or modify tasks created by other users.
- If I navigate to an invalid route, I see a 404 page.

---

*Document version: 1.0 — Based on actual project state at commit time.*
