using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/Families/{familyId}/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public UsersController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersByFamilyId(int familyId)
        {
            try
            {
                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == familyId);

                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                // Retrieve the users belonging to the family
                var users = family.FamilyMembers.ToList();

                if (users == null || !users.Any())
                {
                    return NotFound("No users found for this family.");
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching users: {ex.Message}");
            }
        }
    }
}
