using TaskManager.Domain.ValueObjects;

namespace TaskManager.Tests.Domain;

public class TaskTitleTests
{
    [Fact]
    public void Create_WithValidTitle_ReturnsSuccess()
    {
        var result = TaskTitle.Create("Valid Title");
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be("Valid Title");
    }

    [Fact]
    public void Create_WithEmptyTitle_ReturnsFailure()
    {
        var result = TaskTitle.Create("");
        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "Title cannot be empty.");
    }

    [Fact]
    public void Create_WithWhitespaceTitle_ReturnsFailure()
    {
        var result = TaskTitle.Create("   ");
        result.IsFailed.Should().BeTrue();
    }

    [Fact]
    public void Create_WithTitleExceedingMaxLength_ReturnsFailure()
    {
        var longTitle = new string('a', 201);
        var result = TaskTitle.Create(longTitle);
        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "Title cannot exceed 200 characters.");
    }

    [Fact]
    public void Create_WithTitleAtMaxLength_ReturnsSuccess()
    {
        var title = new string('a', 200);
        var result = TaskTitle.Create(title);
        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public void Equals_SameValue_ReturnsTrue()
    {
        var title1 = TaskTitle.Create("Test").Value;
        var title2 = TaskTitle.Create("Test").Value;
        title1.Equals(title2).Should().BeTrue();
    }

    [Fact]
    public void ImplicitConversion_ToString_ReturnsValue()
    {
        var title = TaskTitle.Create("Test").Value;
        string value = title;
        value.Should().Be("Test");
    }
}
