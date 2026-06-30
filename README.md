# TaskManager

A full-stack task management application built as a technical interview exercise, demonstrating **Clean Architecture**, **Domain-Driven Design**, **CQRS with a custom in-house mediator**, **Test-Driven Development**, and modern full-stack development practices.

Authenticated users can create, read, update, and delete their own tasks. Each task has a title, description, status (Todo / In Progress / Done), and due date. Tasks are strictly scoped to their creator.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 22+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional — for containerized setup)
- [PostgreSQL 16](https://www.postgresql.org/download/) (if running without Docker)

---

## Quick Start

### 1. Clone & Environment Setup

```bash
git clone <repo-url>
cd TaskManager
cp .env.example .env
# Edit .env with your values (defaults work for local dev)
```

### 2. Docker Compose (Easiest)

```bash
docker compose up --build -d
```

| Service | URL |
|---------|-----|
| API | http://localhost:8080 |
| Scalar API docs | http://localhost:8080/openapi/scalar |
| Frontend | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

**Useful commands:**

```bash
# View live logs
docker compose logs -f

# Follow a specific service
docker compose logs -f api

# Stop all services
docker compose down

# Stop and remove volumes (wipes DB data)
docker compose down -v

# Rebuild after code changes
docker compose up --build -d
```

### 3. Manual Setup

#### Backend

```bash
# Update the connection string in appsettings.Development.json or set env vars
export ConnectionStrings__DefaultConnection="Host=localhost;Database=taskmanager;Username=taskmanager;Password=taskmanager_secret"
export Jwt__Secret="your_super_secret_jwt_key_min_32_chars_long_here"
export Jwt__Issuer="TaskManagerAPI"
export Jwt__Audience="TaskManagerWeb"
export FrontendUrl="http://localhost:5173"

cd src/TaskManager.API
dotnet run
```

#### Frontend

```bash
cd frontend/taskmanager-web
npm install
cp .env.example .env  # or set VITE_API_URL=http://localhost:8080
npm run dev
```

---

## Generative AI Tools

This project was built with the assistance of **OpenCode** (DeepSeek models) for backend and frontend code generation, and **Google Stitch** for initial UI mockups and design-system creation. Every AI suggestion was critically evaluated, validated against requirements, and adapted to fit Clean Architecture, DDD, and security best practices.

---

### 1. UI Design with Google Stitch

**Prompt (condensed architecture document):**

> Create a neobrutalist task management UI using React 19 + TypeScript + Material UI following these specifications:
>
> - **Design**: Neobrutalism with 4px black borders, hard drop-shadows (no blur), high-contrast colors, `Montserrat` (headings), `Space Grotesk` (body), `Space Mono` (labels).
> - **Color palette**: Background `#fbf9f1`, primary `#5e6300`, primary container `#f3ff00`, secondary `#006e27`, error `#ba1a1a`, surface variant `#e4e3db`.
> - **Pages**: Login, Register, Dashboard (stat cards + recent tasks + FAB), Task List (kanban board with drag-and-drop), Task Create/Edit, 404.
> - **Layout**: Desktop = fixed sidebar (256px) + sticky top navbar (80px). Mobile = bottom nav bar (80px), top navbar collapses.
> - **Auth**: JWT-based. `ProtectedRoute` guards authenticated routes. Zustand `authStore` persists token + user to localStorage. Axios interceptor attaches Bearer token and handles 401 → redirect to login.
> - **API**: All endpoints return `{ success, data, errors }` envelope. Tasks are user-scoped (no cross-user access). Statuses: Todo (1), InProgress (2), Done (3).
> - **Tech stack**: React 19, TypeScript, Material UI 9, Zustand 5, Axios, React Router 7, Vite 6, `@dnd-kit` for kanban, SCSS + MUI `sx` for styling.

**AI Output:** Generated the full neobrutalist design system — `NeoButton`, `NeoCard`, `NeoInput`, `NeoModal`, `NeoChip` (`StatusChip`), `StatCard`, `SectionHeader`, `SearchBar` — plus page layout components (`Sidebar`, `TopNavbar`, `MobileNav`) and the MUI theme override with custom palette, typography, and component defaults.

**My Analysis:**

- **Validation**: Confirmed all color tokens matched the spec. Verified border widths (4px), shadow offsets (6px/8px/12px), and font stacks were applied consistently across all components.
- **Corrections**: Replaced CSS custom properties with inline MUI `sx` props for consistency (the `tokens.css` variables were generated but never referenced by components). Removed unused components (`SearchBar`, `NeoBadge` with priority colors) that weren't wired to any page. Added micro-interactions (hover → translate 2px, active → translate 4px, shadow reduction).
- **Edge cases**: Added responsive breakpoints — sidebar hidden below `md`, MobileNav hidden above `md`. Added empty-state text per column ("No tasks yet"). Added password complexity validation (uppercase, lowercase, digit, special char) not in the original design.
- **Architecture**: Kept the Component → Page → Store separation clean. All API calls go through Zustand stores or direct API functions, not mixed into components.

---

### 2. Project Scaffolding & Clean Architecture

**Prompt:**

> "Generate a .NET solution with the following layered architecture: Domain (entities, value objects, domain events), Application (CQRS with a custom mediator, handlers, interfaces), Infrastructure (EF Core, Identity, repositories), API (Minimal APIs), Contracts (DTOs). All layers must follow Clean Architecture dependency rules. Use .NET 10 and C# 13."

**AI Output (sample — project structure and a base entity):**

```csharp
// Domain/Entities/Task.cs
public class Task
{
    public Guid Id { get; private set; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public TaskStatus Status { get; private set; }
    public DateTime DueDate { get; private set; }
    public Guid UserId { get; private set; }

    public Task(string title, string description, TaskStatus status, DateTime dueDate, Guid userId)
    {
        Id = Guid.NewGuid();
        Title = title;
        Description = description;
        Status = status;
        DueDate = dueDate;
        UserId = userId;
    }
}
```

**My Analysis:**

- **Validation**: The AI generated a basic entity but omitted validation for non-empty title, future due date, and status enum. I added private setters and factory methods with `FluentResults` to enforce invariants.
- **Corrections**: The AI didn't include domain events. I extended the entity with a list of `IDomainEvent` and a `RaiseDomainEvent` method, aligning with DDD.
- **Edge cases**: Ensured `DueDate` cannot be in the past, `Title` is required (max 200 chars). `Description` is optional (nullable).
- **Architecture**: The AI's project structure was correct, but I moved `IUnitOfWork` and repository interfaces to the Domain layer (not Infrastructure) to keep the domain pure.

---

### 3. Custom In-House Mediator & CQRS Handlers

**Prompt:**

> "Implement a lightweight, in-memory mediator for CQRS in .NET. It should handle `ICommand<TResponse>` and `IQuery<TResponse>` with a single `Send` method. Decorate handlers with logging and validation. Use `FluentResults` for result objects."

**AI Output (sample — mediator and a handler):**

```csharp
public interface IMediator
{
    Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default);
}

public class Mediator : IMediator
{
    private readonly IServiceProvider _serviceProvider;
    public Mediator(IServiceProvider serviceProvider) => _serviceProvider = serviceProvider;

    public async Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken)
    {
        var handlerType = typeof(IRequestHandler<,>).MakeGenericType(request.GetType(), typeof(TResponse));
        dynamic handler = _serviceProvider.GetService(handlerType);
        return await handler.Handle((dynamic)request, cancellationToken);
    }
}

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, Result<TaskDto>>
{
    private readonly ITaskRepository _repository;
    public CreateTaskCommandHandler(ITaskRepository repository) => _repository = repository;

    public async Task<Result<TaskDto>> Handle(CreateTaskCommand command, CancellationToken ct)
    {
        var task = new Task(command.Title, command.Description, command.Status, command.DueDate, command.UserId);
        await _repository.AddAsync(task, ct);
        return Result.Ok(new TaskDto(task));
    }
}
```

**My Analysis:**

- **Validation**: The AI didn't include any validation pipeline. I added a `ValidationBehavior<TCommand>` that runs FluentValidation validators before the handler executes.
- **Corrections**: The mediator used `dynamic` and reflection. I replaced it with a compiled delegate cache using `ConcurrentDictionary` for better performance.
- **Edge cases**: Added `NotFound` checks in handlers for update/delete, returning `Result.Fail` with a descriptive message.
- **Authentication**: The commands already include `UserId` from the authenticated user. I ensured repository methods always filter by `UserId` to enforce data isolation.

---

### 4. Minimal API Endpoints with OpenAPI

**Prompt:**

> "Generate Minimal API endpoints for a Task entity: GET /tasks, GET /tasks/{id}, POST /tasks, PUT /tasks/{id}, DELETE /tasks/{id}. Use the mediator to dispatch commands/queries. Include OpenAPI annotations and return the standard envelope format."

**AI Output (sample — endpoint mapping):**

```csharp
app.MapGet("/api/tasks", async (IMediator mediator, CancellationToken ct) =>
{
    var result = await mediator.Send(new GetTasksQuery(), ct);
    return result.IsSuccess
        ? Results.Ok(new { success = true, data = result.Value })
        : Results.BadRequest(new { success = false, errors = result.Errors });
})
.WithName("GetTasks")
.WithOpenApi();
```

**My Analysis:**

- **Validation**: The AI didn't include authentication. I added `.RequireAuthorization()` to all endpoints except auth routes.
- **Corrections**: The query didn't include the current user's ID. I modified it to extract the user ID from `HttpContext.User` claims and pass it to the query/command.
- **Edge cases**: Added a global `ErrorHandlingMiddleware` to catch unhandled exceptions and return a consistent 500 envelope. Added `UnauthorizedAccessException` handling when the user claim is missing.
- **Authentication/Authorization**: The `GetUserId` helper extracts `ClaimTypes.NameIdentifier` and throws if absent. All task endpoints enforce user scoping at the repository level.

---

### 5. JWT Authentication with ASP.NET Core Identity

**Prompt:**

> "Implement JWT authentication using ASP.NET Core Identity. Provide `/register` and `/login` endpoints. The JWT should contain the user ID and email. Include password hashing and refresh token support (optional)."

**AI Output (sample — login endpoint):**

```csharp
app.MapPost("/api/auth/login", async (LoginRequest request, UserManager<ApplicationUser> userManager, IConfiguration config) =>
{
    var user = await userManager.FindByEmailAsync(request.Email);
    if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
        return Results.Unauthorized();

    var token = GenerateJwtToken(user, config);
    return Results.Ok(new { success = true, data = new { token, user = new { user.Id, user.Email } } });
});
```

**My Analysis:**

- **Validation**: The AI didn't validate the request model. I added FluentValidation for empty email/password and email format.
- **Corrections**: Token generation was missing audience/issuer and explicit expiry. I added `JwtSecurityTokenHandler` with proper claims (`NameIdentifier`, `Email`), set the signing key from configuration, and expiration to 24 hours.
- **Edge cases**: Added password mismatch check in register. Added duplicate email detection ("Email is already registered"). The login endpoint returns a generic error ("Invalid credentials") to avoid user enumeration.
- **Authentication**: The `/me` endpoint returns the current user's email from the token claims. The JWT settings (`Secret`, `Issuer`, `Audience`) are read from environment variables in Docker, falling back to appsettings.json defaults.

---

### 6. Frontend — React with TypeScript & Zustand

**Prompt:**

> "Create a React + TypeScript frontend for a task manager. Use Zustand for state management and Axios for API calls. Include a login page, registration page, and a protected task dashboard with a Kanban board (using @dnd-kit). The UI should follow a neobrutalist design with black borders and bold drop shadows."

**AI Output (sample — auth store and API interceptor):**

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        set({ token: response.data.data.token, user: response.data.data.user });
      },
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

**My Analysis:**

- **Validation**: The AI didn't include error handling for the login call. I wrapped it in try/catch and set error state.
- **Corrections**: The store didn't have an `initialize` method to re-hydrate the token from localStorage. I added it and integrated it into the `ProtectedRoute` component so the session survives page reloads.
- **Edge cases**: Added automatic logout on 401 responses via Axios response interceptor. The interceptor clears localStorage and redirects to `/login`.
- **Architecture**: Split API calls into dedicated functions (`authApi.login`, `tasksApi.getAll`, etc.) instead of calling Axios directly in stores. Added `taskStore` as a second Zustand store to keep concerns separated.

---

### 7. Drag-and-Drop Kanban Board

**Prompt:**

> "Implement a Kanban board using @dnd-kit with three columns (Todo, InProgress, Done). Cards can be dragged between columns and the status updates on the backend via the /tasks/{id} endpoint."

**AI Output (sample — DndContext wrapper):**

```tsx
<DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <div className="board">
    {columns.map(column => (
      <Column key={column.id} id={column.id} tasks={tasksByStatus[column.id]} />
    ))}
  </div>
</DndContext>
```

**My Analysis:**

- **Validation**: The AI didn't provide the `handleDragEnd` implementation. I added logic to determine the target column from the drop position, update the task's status locally, and call the PUT API.
- **Corrections**: The AI used static column IDs. I mapped them to the actual statuses from the backend (`Todo` → 1, `InProgress` → 2, `Done` → 3) and fetched them via `GET /api/tasks/statuses`.
- **Edge cases**: Added optimistic updates for smooth UX — the card moves immediately, and if the API call fails, it reverts to the original column. Added a `DragOverlay` with visual feedback (InProgress cards get a yellow background while dragging).
- **Authentication**: The API call includes the JWT via the Axios interceptor. The backend validates that the user owns the task before updating.

---

### Overall Reflection

Throughout development, I used AI primarily for boilerplate generation and to explore alternative design choices. Every piece of AI-generated code was:

- **Reviewed for correctness** — I ran the existing unit tests and added new ones to cover edge cases. The test suite grew from ~25 to 56 tests covering domain, application, validators, and API endpoint integration.
- **Refactored** — I separated concerns, applied dependency injection properly, and ensured Clean Architecture dependency rules were respected (Domain has zero external dependencies).
- **Extended** — I added missing features like global exception handling, structured logging, comprehensive validation (FluentValidation), and a custom in-memory mediator with a handler cache.
- **Secured** — I hardened the authentication/authorization flows, ensured JWT claims were validated, prevented data leakage between users (all queries filter by `CreatedByUserId`), and used environment variables for secrets.

The AI's suggestions were a valuable starting point, but critical thinking and adherence to best practices (TDD, SOLID, DDD, Clean Architecture) shaped the final product.

---

## License

This project is created as a technical interview exercise.
