using System.ComponentModel.DataAnnotations;
namespace Backend.DTO
{
    public class RegisterDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        [StringLength(14, MinimumLength =6)]
        public string Password { get; set; } = string.Empty;
    }
    public class RegisterDtoHr
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        [StringLength(14, MinimumLength =6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role{get; set;}=string.Empty;

        public int ? ManagerId{get; set;}
    }
     public class ManagerDto
    {
      
        public int Id { get; set; } 
       [Required]
        public string Name { get; set; } = string.Empty;
        
    }
    
}