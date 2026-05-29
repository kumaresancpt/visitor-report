using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace Backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    
    public EmailService(IConfiguration config)
    {
        _config = config;
    }
    
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpHost = _config["SmtpSettings:Host"];
        var smtpPort = int.Parse(_config["SmtpSettings:Port"] ?? "587");
        var smtpUsername = _config["SmtpSettings:Username"];
        var smtpPassword = _config["SmtpSettings:Password"];
        var fromEmail = _config["SmtpSettings:FromEmail"];
        var fromName = _config["SmtpSettings:FromName"];
        
        using (var client = new SmtpClient())
        {
            try
            {
                await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUsername, smtpPassword);
                
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromEmail));
                message.To.Add(MailboxAddress.Parse(to));
                message.Subject = subject;
                
                var bodyBuilder = new BodyBuilder { HtmlBody = body };
                message.Body = bodyBuilder.ToMessageBody();
                
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to send email: {ex.Message}", ex);
            }
        }
    }
    
    public async Task QueueAsyncExportAsync(string adminId, string reportType, DateTime dateFrom, DateTime dateTo)
    {
        // Simulate async export queuing
        // In production, this would use a background job service like Hangfire
        await Task.Delay(100);
    }
}
