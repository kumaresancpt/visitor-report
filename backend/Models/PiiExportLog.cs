using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class PiiExportLog
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string AdminId { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string ReportType { get; set; } = string.Empty;
    
    [Required]
    public string FiltersSerialized { get; set; } = "{}";
    
    [Required]
    public DateTime ExportTimestamp { get; set; } = DateTime.UtcNow;
    
    [Required]
    [MaxLength(50)]
    public string IpAddress { get; set; } = string.Empty;
    
    public bool IncludesFullPii { get; set; }
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
