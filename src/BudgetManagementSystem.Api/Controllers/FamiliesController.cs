using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Families;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using BudgetManagementSystem.Api.Contracts.Members;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> CreateFamily(FamilyCreateRequest familyRequest)
        {
            var familyExists = await _dbContext.Families.AnyAsync(f => f.Title == familyRequest.Title);

            if (familyExists)
            {
                string errors = $"Family with name '{familyRequest.Title}' was found.";
                return new ObjectResult(errors)
                {
                    StatusCode = (int)HttpStatusCode.UnprocessableEntity
                };
            }

            if (familyRequest == null || string.IsNullOrWhiteSpace(familyRequest.Title))
            {
                string errors = "Family title is required.";
                return new ObjectResult(errors)
                {
                    StatusCode = (int)HttpStatusCode.UnprocessableEntity
                };
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
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetFamilies()
        {
            try
            {
                ICollection<FamilyResponse> families = await _dbContext.Families
                    .Select(f => new FamilyResponse
                    {
                        Id = f.Id,
                        Title = f.Title,
                        MembersCount = f.FamilyMembers.Count

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
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetFamilyById(int id)
        {
            try
            {
                var family = await _dbContext.Families.FirstOrDefaultAsync(x => x.Id == id);

                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var familyMembers = await _dbContext.FamilyMembers
                    .Where(fm => fm.FamilyId == id)
                    .Select(fm => new Member
                    {
                        FamilyMemberId = fm.Id,
                        Name = fm.User.Name,
                        Surname = fm.User.Surname,
                        UserName = fm.User.UserName,
                        Email = fm.User.Email
                    })
                    .ToListAsync();

                var familyDto = new FamilyByIdResponse
                {
                    Id = family.Id,
                    Title = family.Title,
                    Members = familyMembers
                };

                return Ok(familyDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the family: {ex.Message}");
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = Role.Owner)]
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
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> UpdateFamily(int id, FamilyCreateRequest updateRequest)
        {
            try
            {
                if (id <= 0)
                {
                    string errors = "Invalid family id.";
                    return new ObjectResult(errors)
                    {
                        StatusCode = (int)HttpStatusCode.UnprocessableEntity
                    };
                }

                if (updateRequest == null)
                {
                    string errors = "Invalid update request.";
                    return new ObjectResult(errors)
                    {
                        StatusCode = (int)HttpStatusCode.UnprocessableEntity
                    };
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