using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class ReportMetricsResponse
{
    public int TotalVisitors { get; set; }
    
    [MaxLength(50)]
    public string AverageDuration { get; set; } = "0h 0m";
    
    public int DeniedEntries { get; set; }
    
    public int Overstays { get; set; }
    
    public int UniqueCompanies { get; set; }
    
    [MaxLength(100)]
    public string MostVisitedDepartment { get; set; } = "N/A";
    
    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;
}
