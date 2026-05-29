using Backend.Models;

namespace Backend.Services;

public interface IReportService
{
    Task<List<VisitRecord>> GetReportDataAsync(DateTime dateFrom, DateTime dateTo, string reportType, ReportFilters? filters);
    Task<ReportMetricsResponse> GetMetricsAsync(DateTime dateFrom, DateTime dateTo, ReportFilters? filters);
    Task<int> GetReportCountAsync(DateTime dateFrom, DateTime dateTo, ReportFilters? filters);
    string MaskId(string idType);
}
