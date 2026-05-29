using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class VisitRecord
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string VisitorName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Company { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string HostEmployee { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Department { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string IdTypeMasked { get; set; } = "XXXX-XXXX-0000";
    
    [Required]
    public DateTime CheckInDate { get; set; }
    
    [Required]
    public TimeSpan CheckInTime { get; set; }
    
    public TimeSpan? CheckOutTime { get; set; }
    
    [MaxLength(50)]
    public string TotalDuration { get; set; } = "0h 0m";
    
    [Required]
    [MaxLength(500)]
    public string VisitPurpose { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending";
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
