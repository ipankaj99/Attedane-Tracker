using Backend.Data;
using Backend.Models;
using Backend.DTO;


namespace Backend.Services
{
    public class UserService
    {
        private readonly AppDbContext _db;

        public UserService(AppDbContext db)
        {
            _db = db;
        }

        public void RegisterUser(User user)
        {
            user.SickLeave = 10;
            user.EarnedLeave = 5;
            user.CasualLeave = 5;

            _db.Users.Add(user);
            _db.SaveChanges();
        }
        public void RegisterUserHr(User user)
        {
            user.SickLeave = 10;
            user.EarnedLeave = 5;
            user.CasualLeave = 5;

            _db.Users.Add(user);
            _db.SaveChanges();
        }

        public User? LoginUser(string email, string password)
        {
            Console.WriteLine($"Email entered: {email}");

            // 1. Fetch the user by email
            var user = _db.Users.FirstOrDefault(u => u.Email == email);
            Console.WriteLine($"User found: {user?.Email}");

            // 2. If user exists, then verify password hash
            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return user;
            }

            // 3. Return null if email not found or password verification fails
            return null;
        }
        
        public User? GetUserById(int userId)
        {
            // Fetch user and include any related data if needed
            return _db.Users.FirstOrDefault(u => u.Id == userId);
        }
        public User? GetUserByEmail(string email)
        {
            return _db.Users.FirstOrDefault(u => u.Email == email);
        }
        public List<ManagerDto> GetAllManagers()
        {
            return _db.Users
                .Where(u => u.Role == "Manager")
                .Select(u => new ManagerDto
                {
                    Id = u.Id,
                    Name = u.Name
                })
                .ToList();
        }
    }
}