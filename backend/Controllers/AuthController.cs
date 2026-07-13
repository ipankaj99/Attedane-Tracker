using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;
using Backend.DTO; // Added this
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtService _jwtService;

        public AuthController(UserService userService, JwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        // [HttpPost("register")]
        // public IActionResult Register([FromBody] RegisterDto request) // Using RegisterDto here
        // {
        //     // Check if email already exists
        //     if (_userService.GetUserByEmail(request.Email) != null)
        //     {
        //         return BadRequest(new { Message = "Email already exists" });
        //     }
        //     // Map the incoming DTO to your actual database Model
        //     string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12);
        //     var newUser = new User
        //     {
        //         Name = request.Name,
        //         Email = request.Email,
        //         PasswordHash = passwordHash
        //     };

        //     _userService.RegisterUser(newUser);
        //     var token = _jwtService.GenerateToken(newUser);

        //     return Ok(new
        //     {
        //         Token = token,
        //         User = new
        //         {
        //             newUser.Id,
        //             newUser.Name,
        //             newUser.Email,
        //             newUser.Role,
        //             newUser.SickLeave,
        //             newUser.EarnedLeave,
        //             newUser.CasualLeave
        //         }
        //     });
        // }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto request) // Using LoginDto here
        {
            var user = _userService.LoginUser(request.Email, request.Password);

            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid email or password" });
            }

            var token = _jwtService.GenerateToken(user);
            Console.WriteLine(token);

            return Ok(new
            {
                Token = token,
                User = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role,
                    user.SickLeave,
                    user.EarnedLeave,
                    user.CasualLeave
                }
            });
        }

        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            // Extract UserId from the JWT token
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (claim == null || !int.TryParse(claim, out int userId))
                return Unauthorized(new { Message = "Invalid token" });

            var user = _userService.GetUserById(userId);
            if (user == null) return NotFound(new { Message = "User not found" });

            // Return the user data (Note: We don't return the PasswordHash for security!)
            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role,
                user.SickLeave,
                user.EarnedLeave,
                user.CasualLeave
            });
        }

        [HttpGet("managers")]
        [Authorize]
        public IActionResult GetManagers()
        {
            // Check for Hr role
            if (User.FindFirst(ClaimTypes.Role)?.Value != "Hr")
            {
                return Forbid();
            }

            var managers = _userService.GetAllManagers();
            return Ok(managers);
        }

        [HttpPost("registerhr")]
        public IActionResult RegisterHr([FromBody] RegisterDtoHr request) // Using RegisterDto here
        {
            // Check if email already exists
            if (_userService.GetUserByEmail(request.Email) != null)
            {
                return BadRequest(new { Message = "Email already exists" });
            }
            // Map the incoming DTO to your actual database Model
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12);
            if (request.Role == "Employee")
            {
                if (request.ManagerId == null)
                {
                    return BadRequest(new { message = "Employees must be assigned to a manager." });
                }

                var manager = _userService.GetUserById(request.ManagerId.Value);

                if (manager == null || manager.Role != "Manager")
                {
                    return BadRequest(new { message = "The selected manager does not exist." });
                }
            }
           
            var newUser = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = request.Role,
                ManagerId = request.ManagerId ?? 7

            };

            _userService.RegisterUserHr(newUser);
            var token = _jwtService.GenerateToken(newUser);

            return Ok(new
            {
                Token = token,
                User = new
                {
                    newUser.Id,
                    newUser.Name,
                    newUser.Email,
                    newUser.Role,
                    newUser.SickLeave,
                    newUser.EarnedLeave,
                    newUser.CasualLeave
                }
            });
        }




    }
}