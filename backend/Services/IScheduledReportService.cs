using Backend.Models;

namespace Backend.Services;

public interface IScheduledReportService
{
    Task<List<ScheduledReport>> GetScheduledReportsAsync(string adminId);
    Task CreateScheduleAsync(ScheduledReport schedule);
    Task UpdateScheduleAsync(ScheduledReport schedule);
    Task DeleteScheduleAsync(Guid id);
}
