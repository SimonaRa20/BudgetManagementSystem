using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Families;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Net;

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
        //[Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> CreateFamily(FamilyCreateRequest familyRequest)
        {
            var familyExists = await _dbContext.Families.AnyAsync(f => f.Title == familyRequest.Title);

            if (familyExists)
            {
                return BadRequest($"Family with name '{familyRequest.Title}' was found.");
            }

            if (familyRequest == null || string.IsNullOrWhiteSpace(familyRequest.Title))
            {
                return BadRequest("Family title is required.");
            }

            try
            {
                var family = new FamilyDto
                {
                    Title = familyRequest.Title,
                };

                _dbContext.Families.Add(family);

                await _dbContext.SaveChangesAsync();

                return Created("", family);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while creating the family: {ex.Message}");
            }
        }

        [HttpGet]
        //[Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetFamilies()
        {
            try
            {
                ICollection<FamilyResponse> families = await _dbContext.Families
                    .Select(f => new FamilyResponse
                    {
                        Id = f.Id,
                        Title = f.Title,
                        Members = f.FamilyMembers

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
        //[Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetFamilyById(int id)
        {
            try
            {
                FamilyResponse family = await _dbContext.Families
                    .Where(x => x.Id == id)
                    .Select(f => new FamilyResponse
                    {
                        Id = f.Id,
                        Title = f.Title,
                        Members = f.FamilyMembers
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

        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<IActionResult> DeleteFamily(int id)
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

                var members = family.FamilyMembers.Count();

                if (members > 0)
                {
                    return BadRequest($"Family has members. Family cannot be deleted");
                }


                _dbContext.Families.Remove(family);
                await _dbContext.SaveChangesAsync();

                return Ok("Family deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while deleting the user: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> UpdateFamily(int id, FamilyCreateRequest updateRequest)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid family id.");
                }

                if (updateRequest == null)
                {
                    return BadRequest("Invalid update request.");
                }

                var existingFamily = await _dbContext.Families.Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (existingFamily == null)
                {
                    return BadRequest("Family not found.");
                }

                if (string.IsNullOrWhiteSpace(updateRequest.Title))
                {
                    string errors = "Title cannot be empty.";
                    return new ObjectResult(errors)
                    {
                        StatusCode = (int)HttpStatusCode.UnprocessableEntity
                    };
                }

                existingFamily.Title = updateRequest.Title;

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
