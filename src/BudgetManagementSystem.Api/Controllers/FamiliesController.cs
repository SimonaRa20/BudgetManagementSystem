using BudgetManagementSystem.Api.Contracts.Families;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FamiliesController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public FamiliesController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateFamily(FamilyCreateRequest familyRequest)
        {
            var familyExists = await _dbContext.Families.AnyAsync(f => f.Name == familyRequest.Title);

            if (familyExists)
            {
                return NotFound($"Family with name '{familyRequest.Title}' was found.");
            }

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

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetFamilies()
        {
            try
            {
                ICollection<FamilyResponse> families = await _dbContext.Families
                    .Select(f => new FamilyResponse
                    {
                        Id = f.Id,
                        Name = f.Name
                    }).ToListAsync();



                if (families == null || !families.Any())
                {
                    return NotFound("No families found.");
                }

                return Ok(families);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the family: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetFamilyById(int id)
        {
            try
            {
                FamilyResponse family = await _dbContext.Families
                    .Where(x => x.Id == id)
                    .Select(f => new FamilyResponse
                    {
                        Id = f.Id,
                        Name = f.Name
                    })
                    .FirstOrDefaultAsync();

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

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateFamily(int id, FamilyCreateRequest updateRequest)
        {
            try
            {
                var existingFamily = await _dbContext.Families.Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (existingFamily == null)
                {
                    return NotFound("Family not found.");
                }

                if (!string.IsNullOrWhiteSpace(updateRequest.Title))
                {
                    existingFamily.Name = updateRequest.Title;
                }

                if (updateRequest.UsersId != null && updateRequest.UsersId.Any())
                {
                    var usersToAdd = await _dbContext.Users.Where(u => updateRequest.UsersId.Contains(u.Id)).ToListAsync();

                    existingFamily.FamilyMembers.Clear();

                    foreach (var user in usersToAdd)
                    {
                        existingFamily.FamilyMembers.Add(user);
                    }
                }

                await _dbContext.SaveChangesAsync();

                return Ok(existingFamily);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating the family: {ex.Message}");
            }
        }
    }
}
