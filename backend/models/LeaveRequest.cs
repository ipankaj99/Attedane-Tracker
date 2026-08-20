using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class LeaveRequest
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public string LeaveType { get; set; } = string.Empty;
        
        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public string Reason { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        
        public double TotalDays { get; set; } 

        public bool IsHalfDay { get; set; } 

       
        public string Session { get; set; } = string.Empty; 

     

        public int? ApprovedBy { get; set; } 
        [ForeignKey("ApprovedBy")]
        public User? Approver { get; set; }
    }
}