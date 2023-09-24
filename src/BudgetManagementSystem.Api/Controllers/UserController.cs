using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Expenses;
using BudgetManagementSystem.Api.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IConfiguration _config;
        private readonly BudgetManagementSystemDbContext _dbContext;

        public UserController(IConfiguration config, BudgetManagementSystemDbContext dbContext)
        {
            _config = config;
            _dbContext = dbContext;
        }

        [HttpGet]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _dbContext.Users.Where(x=>x.Role == Role.Owner).ToListAsync();
                if (users == null)
                {
                    return NotFound("Users not found");
                }
                
                return Ok(users);
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
                var user = await _dbContext.Users.Where(x => x.Id == userId).FirstOrDefaultAsync();
                if (user == null)
                {
                    return NotFound("User not found");
                }

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
