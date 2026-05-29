using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;
    
    public ReportService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<VisitRecord>> GetReportDataAsync(DateTime dateFrom, DateTime dateTo, string reportType, ReportFilters? filters)
    {
        var query = _context.VisitRecords
            .Where(v => v.CheckInDate.Date >= dateFrom.Date && v.CheckInDate.Date <= dateTo.Date)
            .AsQueryable();
        
        if (filters != null)
        {
            if (!string.IsNullOrEmpty(filters.Department))
                query = query.Where(v => v.Department == filters.Department);
            
            if (!string.IsNullOrEmpty(filters.HostEmployee))
                query = query.Where(v => v.HostEmployee == filters.HostEmployee);
            
            if (!string.IsNullOrEmpty(filters.VisitPurpose))
                query = query.Where(v => v.VisitPurpose == filters.VisitPurpose);
            
            if (!string.IsNullOrEmpty(filters.Status))
                query = query.Where(v => v.Status == filters.Status);
        }
        
        var result = reportType switch
        {
            "PendingApprovals" => await query
                .Where(v => v.Status == "Pending")
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync(),
            
            "OverstayReport" => await query
                .Where(v => v.Status == "Checked-Out")
                .ToListAsync()
                .ContinueWith(t => t.Result.Where(v =>
                {
                    if (TimeSpan.TryParse(v.TotalDuration, out var duration))
                        return duration.TotalMinutes > 240;
                    return false;
                }).ToList()),
            
            "DepartmentWiseCount" => await query
                .OrderBy(v => v.Department)
                .ToListAsync(),
            
            "FrequentVisitors" => await query
                .OrderBy(v => v.VisitorName)
                .ToListAsync()
                .ContinueWith(t => t.Result
                    .GroupBy(v => v.VisitorName)
                    .OrderByDescending(g => g.Count())
                    .Take(20)
                    .SelectMany(g => g)
                    .ToList()),
            
            "SecurityIncidents" => await query
                .Where(v => v.Status == "Denied")
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync(),
            
            _ => await query.OrderByDescending(v => v.CheckInDate).ToListAsync()
        };
        
        return result;
    }
    
    public async Task<ReportMetricsResponse> GetMetricsAsync(DateTime dateFrom, DateTime dateTo, ReportFilters? filters)
    {
        var query = _context.VisitRecords
            .Where(v => v.CheckInDate.Date >= dateFrom.Date && v.CheckInDate.Date <= dateTo.Date)
            .AsQueryable();
        
        if (filters != null)
        {
            if (!string.IsNullOrEmpty(filters.Department))
                query = query.Where(v => v.Department == filters.Department);
            
            if (!string.IsNullOrEmpty(filters.HostEmployee))
                query = query.Where(v => v.HostEmployee == filters.HostEmployee);
            
            if (!string.IsNullOrEmpty(filters.VisitPurpose))
                query = query.Where(v => v.VisitPurpose == filters.VisitPurpose);
            
            if (!string.IsNullOrEmpty(filters.Status))
                query = query.Where(v => v.Status == filters.Status);
        }
        
        var records = await query.ToListAsync();
        
        var avgDuration = CalculateAvgDuration(records);
        var deniedCount = records.Count(v => v.Status == "Denied");
        var overstayCount = records.Count(v =>
        {
            if (TimeSpan.TryParse(v.TotalDuration, out var duration))
                return duration.TotalMinutes > 240;
            return false;
        });
        var uniqueCompanies = records.Select(v => v.Company).Distinct().Count();
        var mostVisitedDept = records
            .GroupBy(v => v.Department)
            .OrderByDescending(g => g.Count())
            .FirstOrDefault()?.Key ?? "N/A";
        
        return new ReportMetricsResponse
        {
            TotalVisitors = records.Count,
            AverageDuration = avgDuration,
            DeniedEntries = deniedCount,
            Overstays = overstayCount,
            UniqueCompanies = uniqueCompanies,
            MostVisitedDepartment = mostVisitedDept,
            CalculatedAt = DateTime.UtcNow
        };
    }
    
    public async Task<int> GetReportCountAsync(DateTime dateFrom, DateTime dateTo, ReportFilters? filters)
    {
        var query = _context.VisitRecords
            .Where(v => v.CheckInDate.Date >= dateFrom.Date && v.CheckInDate.Date <= dateTo.Date)
            .AsQueryable();
        
        if (filters != null)
        {
            if (!string.IsNullOrEmpty(filters.Department))
                query = query.Where(v => v.Department == filters.Department);
            
            if (!string.IsNullOrEmpty(filters.HostEmployee))
                query = query.Where(v => v.HostEmployee == filters.HostEmployee);
            
            if (!string.IsNullOrEmpty(filters.VisitPurpose))
                query = query.Where(v => v.VisitPurpose == filters.VisitPurpose);
            
            if (!string.IsNullOrEmpty(filters.Status))
                query = query.Where(v => v.Status == filters.Status);
        }
        
        return await query.CountAsync();
    }
    
    public string MaskId(string idType)
    {
        if (string.IsNullOrEmpty(idType))
            return "XXXX-XXXX-0000";
        
        return idType.Length > 4
            ? "XXXX-XXXX-" + idType.Substring(idType.Length - 4)
            : "XXXX-XXXX-0000";
    }
    
    private string CalculateAvgDuration(List<VisitRecord> records)
    {
        if (!records.Any())
            return "0h 0m";
        
        var totalMinutes = 0;
        var validCount = 0;
        
        foreach (var record in records)
        {
            if (TimeSpan.TryParse(record.TotalDuration, out var duration))
            {
                totalMinutes += (int)duration.TotalMinutes;
                validCount++;
            }
        }
        
        if (validCount == 0)
            return "0h 0m";
        
        var avgMinutes = totalMinutes / validCount;
        var hours = avgMinutes / 60;
        var minutes = avgMinutes % 60;
        
        return $"{hours}h {minutes}m";
    }
}
