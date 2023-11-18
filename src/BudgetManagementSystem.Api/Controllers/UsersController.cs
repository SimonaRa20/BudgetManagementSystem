using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Auth;
using BudgetManagementSystem.Api.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly IConfiguration _config;
        private readonly BudgetManagementSystemDbContext _dbContext;

        public UsersController(IConfiguration config, BudgetManagementSystemDbContext dbContext)
        {
            _config = config;
            _dbContext = dbContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _dbContext.Users.Where(x=>x.Role == Role.Owner).ToListAsync();
                if (users == null)
                {
                    return NotFound("Users not found");
                }

                var userResponses = users.Select(userDto => new UserResponse
                {
                    Id = userDto.Id,
                    Name = userDto.Name,
                    Surname = userDto.Surname,
                    UserName = userDto.UserName,
                    Email = userDto.Email
                }).ToList();

                return Ok(userResponses);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching users: {ex.Message}");
            }
        }

        [HttpDelete]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId);

                if (user == null)
                {
                    return NotFound("User not found");
                }

                var familyMembersToDelete = _dbContext.FamilyMembers.Where(fm => fm.UserId == userId);
                _dbContext.FamilyMembers.RemoveRange(familyMembersToDelete);

                var expensesToDelete = _dbContext.Expenses.Where(e => e.FamilyMember.UserId == userId);
                _dbContext.Expenses.RemoveRange(expensesToDelete);

                var incomesToDelete = _dbContext.Incomes.Where(i => i.FamilyMember.UserId == userId);
                _dbContext.Incomes.RemoveRange(incomesToDelete);

                _dbContext.Users.Remove(user);

                await _dbContext.SaveChangesAsync();

                return Ok("User deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while deleting users: {ex.Message}");
            }
        }

    }
}
