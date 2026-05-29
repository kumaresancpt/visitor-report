using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class ReportDataRequest
{
    [Required]
    public DateTime DateFrom { get; set; }
    
    [Required]
    public DateTime DateTo { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string ReportType { get; set; } = string.Empty;
    
    public ReportFilters? Filters { get; set; }
}

public class ReportFilters
{
    [MaxLength(100)]
    public string? Department { get; set; }
    
    [MaxLength(100)]
    public string? HostEmployee { get; set; }
    
    [MaxLength(200)]
    public string? VisitPurpose { get; set; }
    
    [MaxLength(50)]
    public string? Status { get; set; }
}

public class ReportExportRequest : ReportDataRequest
{
    [Required]
    [MaxLength(20)]
    public string ExportFormat { get; set; } = string.Empty;
}
