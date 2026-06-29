using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManager.Domain.Entities;

namespace TaskManager.Infrastructure.Data.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("TaskItems");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.OwnsOne(x => x.Title, t =>
        {
            t.Property(p => p.Value).HasColumnName("Title").HasMaxLength(200).IsRequired();
        });
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.StatusId).IsRequired();
        builder.Property(x => x.CreatedByUserId).IsRequired().HasMaxLength(450);
        builder.Property(x => x.CreatedAt).IsRequired();
        builder.Property(x => x.UpdatedAt);
        builder.HasOne(x => x.Status).WithMany().HasForeignKey(x => x.StatusId);
        builder.HasIndex(x => x.CreatedByUserId);
        builder.Ignore(x => x.DomainEvents);
    }
}
