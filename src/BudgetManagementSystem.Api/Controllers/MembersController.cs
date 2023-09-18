using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/Families/{familyId}/[controller]")]
    [ApiController]
    public class MembersController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public MembersController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetMembersByFamilyId(int familyId)
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

                var members = family.FamilyMembers.ToList();

                if (members == null || !members.Any())
                {
                    return NotFound("No members found for this family.");
                }

                var userUpdates = members.Select(u => new UserUpdate
                {
                    Id = u.Id,
                    Name = u.Name,
                    Surname = u.Surname,
                    UserName = u.UserName,
                    Email = u.Email
                }).ToList();

                return Ok(userUpdates);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching users: {ex.Message}");
            }
        }
    }
}
