using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;
using TaskManager.Infrastructure.Data;

namespace TaskManager.Infrastructure.Repositories;

public class TaskRepository(ApplicationDbContext context) : ITaskRepository
{
    public async Task<TaskItem?> GetByIdAsync(Guid id, string userId)
    {
        return await context.TaskItems
            .Include(t => t.Status)
            .FirstOrDefaultAsync(t => t.Id == id && t.CreatedByUserId == userId);
    }

    public async Task<IEnumerable<TaskItem>> GetAllByUserAsync(string userId)
    {
        return await context.TaskItems
            .Include(t => t.Status)
            .Where(t => t.CreatedByUserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(TaskItem task)
    {
        await context.TaskItems.AddAsync(task);
    }

    public void Update(TaskItem task)
    {
        context.TaskItems.Update(task);
    }

    public void Delete(TaskItem task)
    {
        context.TaskItems.Remove(task);
    }
}
