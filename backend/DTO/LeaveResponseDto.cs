namespace Backend.DTO
{
  
    public class LeaveResponseDto
    {
        public int Id { get; set; }
        public string? EmployeeName { get; set; }
        public string? LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; }
    
        public double TotalDays { get; set; }
        public bool IsHalfDay { get; set; }
        public string? Session { get; set; } // "Morning", "Evening", or ""
    }
}
