using System.ComponentModel.DataAnnotations;
namespace Backend.DTO
{
    public class LeaveRequestDto
    {
        [Required]
        public string LeaveType { get; set; } = string.Empty;
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public string Reason { get; set; } = string.Empty;
        [Required]

        public bool IsHalfDay { get; set; }
        
        public string Session { get; set; } = string.Empty; // "Morning", "Evening", or ""
        [Required]
        public double TotalDays { get; set; }
    }
}