using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Backend.Models;
using Backend.Services;
using Backend.DTO;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LeaveController : ControllerBase
    {
        private readonly LeaveService _leaveService;

        public LeaveController(LeaveService leaveService)
        {
            _leaveService = leaveService;
        }

        // Helper method to safely extract UserId from token
        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(claim, out int userId)) return userId;
            return null;
        }



        [HttpPost("apply")]
        [Authorize]
        public IActionResult ApplyForLeave([FromBody] LeaveRequestDto request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized(new { Message = "Invalid user token." });

            // 1. Calculate the days on the SERVER to ensure security
            double calculatedDays = (request.EndDate.Date - request.StartDate.Date).Days + 1.0;
            if (request.IsHalfDay)
            {
                calculatedDays -= 0.5;
            }
            Console.WriteLine("calculatedDays in controller is" + calculatedDays);

            // 2. Map only the data the user IS allowed to provide
            var leaveRequest = new LeaveRequest
            {
                UserId = userId.Value,
                LeaveType = request.LeaveType,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Reason = request.Reason,
                IsHalfDay = request.IsHalfDay,
                Session = request.Session,
                TotalDays = calculatedDays, // Use the server-calculated value!
                Status = "Pending"
            };

            var result = _leaveService.ApplyForLeave(leaveRequest);

            return result == "Success"
                ? Ok(new { Message = "Submitted." })
                : BadRequest(new { Message = result });
        }

        [HttpGet("all")]
        [Authorize]
        public IActionResult GetAllLeaves()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            // Allow access only if role is Manager OR HR
            if (role != "Manager" && role != "Hr")
            {
                return Forbid();
            }

            var managerId = GetUserId();
            if (managerId == null) return Unauthorized();

            return Ok(_leaveService.GetAllLeavesForManager(managerId.Value));
        }

        [HttpGet("my-leaves")]
        [Authorize]
        public IActionResult GetMyLeaves()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            return Ok(_leaveService.GetLeavesByUserId(userId.Value));
        }

        [HttpPut("{id}/review")]
        [Authorize]
        public IActionResult ReviewLeave(int id, [FromBody] ReviewLeaveDto request)
        {
            if (User.FindFirst(ClaimTypes.Role)?.Value == "Employee")
                return Forbid();

            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (claim == null || !int.TryParse(claim, out int managerId))
                return Unauthorized();

            var result = _leaveService.UpdateLeaveStatus(id, request.Status, managerId);

            return result == "Success"
                ? Ok(new { Message = "Updated." })
                : NotFound(new { Message = result });
        }
    }
}