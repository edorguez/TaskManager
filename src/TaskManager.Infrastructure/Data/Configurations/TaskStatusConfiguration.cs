using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskManager.Infrastructure.Data.Configurations;

public class TaskStatusConfiguration : IEntityTypeConfiguration<Domain.Entities.TaskStatus>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.TaskStatus> builder)
    {
        builder.ToTable("TaskStatuses");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50);

        builder.HasData(
            new Domain.Entities.TaskStatus { Id = 1, Name = "Todo" },
            new Domain.Entities.TaskStatus { Id = 2, Name = "InProgress" },
            new Domain.Entities.TaskStatus { Id = 3, Name = "Done" }
        );
    }
}
