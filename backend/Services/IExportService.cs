using Backend.Models;

namespace Backend.Services;

public interface IExportService
{
    Task<byte[]> GenerateAsync(List<VisitRecord> data, ReportExportRequest request);
}

public interface IPdfExportService : IExportService
{
}

public interface IExcelExportService : IExportService
{
}
