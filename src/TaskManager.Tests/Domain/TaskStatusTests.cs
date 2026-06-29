using TaskStatus = TaskManager.Domain.Entities.TaskStatus;

namespace TaskManager.Tests.Domain;

public class TaskStatusTests
{
    [Fact]
    public void CanCreateTaskStatus()
    {
        var status = new TaskStatus { Id = 1, Name = "Todo" };
        status.Id.Should().Be(1);
        status.Name.Should().Be("Todo");
    }

    [Fact]
    public void DifferentStatuses_HaveDifferentIds()
    {
        var todo = new TaskStatus { Id = 1, Name = "Todo" };
        var done = new TaskStatus { Id = 3, Name = "Done" };
        todo.Id.Should().NotBe(done.Id);
    }
}
