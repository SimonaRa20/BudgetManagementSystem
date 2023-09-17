using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FamilyController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public FamilyController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFamily(FamilyCreateRequest familyRequest)
        {
            if (familyRequest == null || string.IsNullOrWhiteSpace(familyRequest.Title))
            {
                return BadRequest("Family title is required.");
            }

            try
            {
                var family = new FamilyDto
                {
                    Name = familyRequest.Title,
                };

                _dbContext.Families.Add(family);

                if (familyRequest.UsersId != null && familyRequest.UsersId.Any())
                {
                    var usersToAdd = await _dbContext.Users.Where(u => familyRequest.UsersId.Contains(u.Id)).ToListAsync();
                    family.FamilyMembers = usersToAdd;
                }

                await _dbContext.SaveChangesAsync();

                return Ok(family);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while creating the family: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFamilyById(int id)
        {
            try
            {
                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                return Ok(family);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the family: {ex.Message}");
            }
        }
    }
}
