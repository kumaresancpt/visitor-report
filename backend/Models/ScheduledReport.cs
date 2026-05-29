using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class ScheduledReport
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
    [MaxLength(50)]
    public string Frequency { get; set; } = "Daily";
    
    public int? DayOfWeek { get; set; }
    
    public int? DayOfMonth { get; set; }
    
    [Required]
    public TimeSpan DeliveryTime { get; set; }
    
    [Required]
    public string RecipientEmailsSerialized { get; set; } = "[]";
    
    public bool IsActive { get; set; } = true;
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Required]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
