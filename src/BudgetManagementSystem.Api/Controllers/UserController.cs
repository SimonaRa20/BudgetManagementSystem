using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public UserController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _dbContext.Users.ToListAsync();

            if (users == null)
            {
                return NotFound("Empty users table.");
            }

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(f => f.Id == id);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdate updatedUser)
        {
            if (updatedUser == null)
            {
                return BadRequest("User data is missing.");
            }

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            List<string> errors = new List<string>();

            if (updatedUser.Email.IsNullOrEmpty() || !updatedUser.Email.Contains('@'))
            {
                errors.Add("Invalid email format.");
            }

            if (string.IsNullOrWhiteSpace(updatedUser.Name))
            {
                errors.Add("User name is necessary.");
            }

            if (string.IsNullOrWhiteSpace(updatedUser.Surname))
            {
                errors.Add("User surname is necessary.");
            }

            if (user.Email != updatedUser.Email && _dbContext.Users.Any(u => u.Email == updatedUser.Email))
            {
                errors.Add("User with the same email already exists.");
            }

            if (errors.Count > 0)
            {
                return BadRequest(errors);
            }

            try
            {
                user.Name = updatedUser.Name;
                user.Surname = updatedUser.Surname;
                user.UserName = updatedUser.UserName;
                user.Email = updatedUser.Email;

                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();
                return Ok(user);

            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred while processing the request.");
            }
        }
    }
}
