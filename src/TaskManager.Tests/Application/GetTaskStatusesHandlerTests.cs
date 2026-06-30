using TaskManager.Application.Tasks.Queries;

namespace TaskManager.Tests.Application;

public class GetTaskStatusesHandlerTests
{
    [Fact]
    public async Task Handle_ReturnsAllStatuses()
    {
        var handler = new GetTaskStatusesHandler();
        var query = new GetTaskStatusesQuery();

        var result = await handler.Handle(query, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().HaveCount(3);
        result.Value.Should().Contain(s => s.Name == "Todo");
        result.Value.Should().Contain(s => s.Name == "InProgress");
        result.Value.Should().Contain(s => s.Name == "Done");
    }
}
