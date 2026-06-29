using Mapster;
using TaskManager.Contracts.Tasks;
using TaskItem = TaskManager.Domain.Entities.TaskItem;

namespace TaskManager.Application.Mapping;

public static class MappingProfile
{
    public static void Configure()
    {
        TypeAdapterConfig<TaskItem, TaskResponse>.NewConfig()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.Title, src => src.Title.Value)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.Status, src => src.Status.Name)
            .Map(dest => dest.DueDate, src => src.DueDate.Value)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt);

        TypeAdapterConfig<Domain.Entities.TaskStatus, TaskStatusResponse>.NewConfig()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.Name, src => src.Name);
    }
}
