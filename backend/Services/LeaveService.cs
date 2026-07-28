using Backend.Data;
using Backend.Models;
using Backend.DTO;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class LeaveService
    {
        private readonly AppDbContext _db;

        public LeaveService(AppDbContext db)
        {
            _db = db;
        }

        public string ApplyForLeave(LeaveRequest request)
        {
            // 1. Validation: Prevent past dates
            if (request.StartDate.Date < DateTime.Today)
            {
                return "You cannot apply for a leave in the past.";
            }

            if (request.EndDate.Date < request.StartDate.Date)
            {
                return "End date cannot be before the start date.";
            }

            // 2. Get the user
            var user = _db.Users.Find(request.UserId);
            if (user == null) return "User not found.";
            double requestedDays = request.TotalDays;
            bool success = false;
            if (request.LeaveType == "Sick" && user.SickLeave >= requestedDays)
            {
                user.SickLeave -= requestedDays;
                success = true;
            }
            else if (request.LeaveType == "Casual" && user.CasualLeave >= requestedDays)
            {
                user.CasualLeave -= requestedDays;
                success = true;
            }
            else if (request.LeaveType == "Earned" && user.EarnedLeave >= requestedDays)
            {
                user.EarnedLeave -= requestedDays;
                success = true;
            }

            if (!success) return "Not enough leave balance.";

            request.Status = "Pending";
            _db.LeaveRequests.Add(request);
            // _db.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _db.SaveChanges();
            return "Success";
        }
        public List<LeaveResponseDto> GetAllLeavesForManager(int managerId)
        {
            // 1. Fetch requests with their related User data in one query
            var requests = _db.LeaveRequests
                .Include(l => l.User) // This loads the User object automatically
                .Where(l => l.User!.ManagerId == managerId)
                .OrderByDescending(l => l.Id)
                .ToList();

            // 2. Map everything
            return requests.Select(req => new LeaveResponseDto
            {
                Id = req.Id,
                EmployeeName = req.User?.Name ?? "Unknown",
                LeaveType = req.LeaveType,
                StartDate = req.StartDate,
                EndDate = req.EndDate,
                Reason = req.Reason,
                Status = req.Status,
          
                TotalDays = req.TotalDays,
                IsHalfDay = req.IsHalfDay,
                Session = req.Session
            }).ToList();
        }

        public List<LeaveRequest> GetLeavesByUserId(int userId)
        {
            return _db.LeaveRequests.Where(l => l.UserId == userId).Include(l => l.Approver).OrderByDescending(l => l.Id).ToList();
        }



        public string UpdateLeaveStatus(int id, string status, int managerId)
        {
            var leave = _db.LeaveRequests.Find(id);
            if (leave == null) return "Request not found.";

            if (leave.Status != "Pending") return "Request already processed.";

            var user = _db.Users.Find(leave.UserId);
            if (user == null) return "User associated with request not found.";


            double durationToRefund = leave.TotalDays;

            if (status == "Rejected")
            {
                // Refund the exact amount that was previously deducted
                if (leave.LeaveType.Equals("Sick", StringComparison.OrdinalIgnoreCase))
                    user.SickLeave += durationToRefund;
                else if (leave.LeaveType.Equals("Casual", StringComparison.OrdinalIgnoreCase))
                    user.CasualLeave += durationToRefund;
                else if (leave.LeaveType.Equals("Earned", StringComparison.OrdinalIgnoreCase))
                    user.EarnedLeave += durationToRefund;
            }

           
            leave.Status = status;
            leave.ApprovedBy = managerId;

            _db.SaveChanges();
            return "Success";
        }
    }
}