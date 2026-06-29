using TaskManager.Domain.Interfaces;
using TaskManager.Domain.ValueObjects;

namespace TaskManager.Tests.Domain;

public class DueDateTests
{
    private readonly IDateTimeProvider _dateTimeProvider;

    public DueDateTests()
    {
        _dateTimeProvider = Substitute.For<IDateTimeProvider>();
        _dateTimeProvider.UtcNow.Returns(new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));
    }

    [Fact]
    public void Create_WithFutureDate_ReturnsSuccess()
    {
        var futureDate = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc);
        var result = DueDate.Create(futureDate, _dateTimeProvider);
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(futureDate);
    }

    [Fact]
    public void Create_WithPastDate_ReturnsFailure()
    {
        var pastDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var result = DueDate.Create(pastDate, _dateTimeProvider);
        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "Due date must be in the future.");
    }

    [Fact]
    public void Create_WithCurrentDate_ReturnsFailure()
    {
        var result = DueDate.Create(_dateTimeProvider.UtcNow, _dateTimeProvider);
        result.IsFailed.Should().BeTrue();
    }

    [Fact]
    public void Equals_SameValue_ReturnsTrue()
    {
        var date = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc);
        var dueDate1 = DueDate.Create(date, _dateTimeProvider).Value;
        var dueDate2 = DueDate.Create(date, _dateTimeProvider).Value;
        dueDate1.Equals(dueDate2).Should().BeTrue();
    }
}
