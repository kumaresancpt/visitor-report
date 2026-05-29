namespace Backend.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task QueueAsyncExportAsync(string adminId, string reportType, DateTime dateFrom, DateTime dateTo);
}
