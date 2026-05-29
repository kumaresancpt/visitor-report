using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class ScheduledReportService : IScheduledReportService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    
    public ScheduledReportService(AppDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }
    
    public async Task<List<ScheduledReport>> GetScheduledReportsAsync(string adminId)
    {
        return await _context.ScheduledReports
            .Where(sr => sr.AdminId == adminId)
            .OrderByDescending(sr => sr.CreatedAt)
            .ToListAsync();
    }
    
    public async Task CreateScheduleAsync(ScheduledReport schedule)
    {
        schedule.CreatedAt = DateTime.UtcNow;
        schedule.UpdatedAt = DateTime.UtcNow;
        _context.ScheduledReports.Add(schedule);
        await _context.SaveChangesAsync();
    }
    
    public async Task UpdateScheduleAsync(ScheduledReport schedule)
    {
        schedule.UpdatedAt = DateTime.UtcNow;
        _context.ScheduledReports.Update(schedule);
        await _context.SaveChangesAsync();
    }
    
    public async Task DeleteScheduleAsync(Guid id)
    {
        var schedule = await _context.ScheduledReports.FindAsync(id);
        if (schedule != null)
        {
            _context.ScheduledReports.Remove(schedule);
            await _context.SaveChangesAsync();
        }
    }
}
