using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly IPdfExportService _pdfExportService;
    private readonly IExcelExportService _excelExportService;
    private readonly IEmailService _emailService;
    private readonly IScheduledReportService _scheduledReportService;
    private readonly IAuthService _authService;
    
    public ReportsController(
        IReportService reportService,
        IPdfExportService pdfExportService,
        IExcelExportService excelExportService,
        IEmailService emailService,
        IScheduledReportService scheduledReportService,
        IAuthService authService)
    {
        _reportService = reportService;
        _pdfExportService = pdfExportService;
        _excelExportService = excelExportService;
        _emailService = emailService;
        _scheduledReportService = scheduledReportService;
        _authService = authService;
    }
    
    /// <summary>
    /// Get report data with optional filtering (AC-04, AC-06)
    /// </summary>
    [HttpGet("data")]
    public async Task<IActionResult> GetReportData(
        [FromQuery] DateTime dateFrom,
        [FromQuery] DateTime dateTo,
        [FromQuery] string? department = null,
        [FromQuery] string? hostEmployee = null,
        [FromQuery] string? visitPurpose = null,
        [FromQuery] string? status = null,
        [FromQuery] string? reportType = "FullVisitorLog")
    {
        try
        {
            var filters = new ReportFilters
            {
                Department = department,
                HostEmployee = hostEmployee,
                VisitPurpose = visitPurpose,
                Status = status
            };
            
            var data = await _reportService.GetReportDataAsync(dateFrom, dateTo, reportType, filters);
            return Ok(data);
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
    
    /// <summary>
    /// Get metrics summary for date range and filters (AC-05)
    /// </summary>
    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics(
        [FromQuery] DateTime dateFrom,
        [FromQuery] DateTime dateTo,
        [FromQuery] string? department,
        [FromQuery] string? hostEmployee,
        [FromQuery] string? visitPurpose,
        [FromQuery] string? status)
    {
        try
        {
            var filters = new ReportFilters
            {
                Department = department,
                HostEmployee = hostEmployee,
                VisitPurpose = visitPurpose,
                Status = status
            };
            
            var metrics = await _reportService.GetMetricsAsync(dateFrom, dateTo, filters);
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
    
    /// <summary>
    /// Export report as PDF (AC-07)
    /// </summary>
    [HttpPost("export-pdf")]
    public async Task<IActionResult> ExportPdf([FromBody] ReportExportRequest request)
    {
        try
        {
            var data = await _reportService.GetReportDataAsync(request.DateFrom, request.DateTo, request.ReportType, request.Filters);
            var pdf = await _pdfExportService.GenerateAsync(data, request);
            return File(pdf, "application/pdf", $"report-{DateTime.Now:yyyyMMdd-HHmmss}.pdf");
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
    
    /// <summary>
    /// Export report as Excel (AC-08)
    /// </summary>
    [HttpPost("export-excel")]
    public async Task<IActionResult> ExportExcel([FromBody] ReportExportRequest request)
    {
        try
        {
            var data = await _reportService.GetReportDataAsync(request.DateFrom, request.DateTo, request.ReportType, request.Filters);
            var excel = await _excelExportService.GenerateAsync(data, request);
            return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"report-{DateTime.Now:yyyyMMdd-HHmmss}.xlsx");
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
    
    /// <summary>
    /// Queue async export for large reports and email download link (AC-09)
    /// </summary>
    [HttpPost("export-large")]
    public async Task<IActionResult> ExportLarge([FromBody] ReportExportRequest request)
    {
        try
        {
            var count = await _reportService.GetReportCountAsync(request.DateFrom, request.DateTo, request.Filters);
            if (count < 1000)
            {
                return BadRequest(new { detail = "Report has fewer than 1000 rows. Use standard export." });
            }
            
            var adminId = _authService.GetUserId(User);
            await _emailService.QueueAsyncExportAsync(adminId, request.ReportType, request.DateFrom, request.DateTo);
            
            return Ok(new { message = "Your report is being generated. We will email you the download link within 5 minutes." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
    
    /// <summary>
    /// Get scheduled reports for current admin (AC-10)
    /// </summary>
    [HttpGet("scheduled")]
    public async Task<IActionResult> GetScheduledReports()
    {
        try
        {
            var adminId = _authService.GetUserId(User);
            var schedules = await _scheduledReportService.GetScheduledReportsAsync(adminId);
            return Ok(schedules);
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
    
    /// <summary>
    /// Create a new scheduled report (AC-10)
    /// </summary>
    [HttpPost("scheduled")]
    public async Task<IActionResult> CreateScheduledReport([FromBody] ScheduledReport request)
    {
        try
        {
            request.AdminId = _authService.GetUserId(User);
            await _scheduledReportService.CreateScheduleAsync(request);
            return Ok(new { id = request.Id, message = "Scheduled report created successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
    
    /// <summary>
    /// Update a scheduled report (AC-10)
    /// </summary>
    [HttpPut("scheduled/{id}")]
    public async Task<IActionResult> UpdateScheduledReport(Guid id, [FromBody] ScheduledReport request)
    {
        try
        {
            request.Id = id;
            request.AdminId = _authService.GetUserId(User);
            await _scheduledReportService.UpdateScheduleAsync(request);
            return Ok(new { message = "Scheduled report updated successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
    
    /// <summary>
    /// Delete a scheduled report (AC-10)
    /// </summary>
    [HttpDelete("scheduled/{id}")]
    public async Task<IActionResult> DeleteScheduledReport(Guid id)
    {
        try
        {
            await _scheduledReportService.DeleteScheduleAsync(id);
            return Ok(new { message = "Scheduled report deleted successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
}
