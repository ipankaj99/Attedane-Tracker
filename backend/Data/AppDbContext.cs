using Backend.Models;
using Microsoft.EntityFrameworkCore;
namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User>Users {get; set;}
        public DbSet<LeaveRequest>LeaveRequests {get; set;}

        public AppDbContext(DbContextOptions<AppDbContext>options): base(options)
        {  
        }
        
    }
}