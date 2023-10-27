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
using System.Security.Claims;

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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == int.Parse(userId));

            if (user == null)
            {
                return BadRequest("User not found.");
            }

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

                var familyMember = new FamilyMemberDto
                {
                    Family = family,
                    User = user,
                    Type = MemberType.Other
                };

                _dbContext.FamilyMembers.Add(familyMember);

                await _dbContext.SaveChangesAsync();

                var familyResponse = new FamilyResponse
                {
                    Id = family.Id,
                    Title = family.Title,
                    MembersCount = family.FamilyMembers.Count
                };

                return Created("", familyResponse);
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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            try
            {
                ICollection<FamilyResponse> families = await _dbContext.Families
                    .Where(f => f.FamilyMembers.Any(fm => fm.UserId == int.Parse(userId)))
                    .Select(f => new FamilyResponse
                    {
                        Id = f.Id,
                        Title = f.Title,
                        MembersCount = f.FamilyMembers.Count
                    })
                    .ToListAsync();

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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            try
            {
                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == id && f.FamilyMembers.Any(fm => fm.UserId == int.Parse(userId)));

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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            try
            {
                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (userRole == Role.Owner || family.FamilyMembers.Any(fm => fm.UserId == int.Parse(userId)))
                {
                    var members = family.FamilyMembers.Count;

                    if (members > 0)
                    {
                        return BadRequest("Family has members. Family cannot be deleted");
                    }

                    _dbContext.Families.Remove(family);
                    await _dbContext.SaveChangesAsync();

                    return Ok("Family deleted successfully.");
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while deleting the family: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> UpdateFamily(int id, [FromBody] FamilyCreateRequest updateRequest)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

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

                var existingFamily = await _dbContext.Families.Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (existingFamily == null)
                {
                    return BadRequest("Family not found.");
                }

                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (userRole == Role.Owner || existingFamily.FamilyMembers.Any(fm => fm.UserId == int.Parse(userId)))
                {
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

                    var familyUpdated = new FamilyByIdResponse
                    {
                        Id = existingFamily.Id,
                        Title = existingFamily.Title,
                        Members = familyMembers
                    };

                    return Ok(familyUpdated);
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating the family: {ex.Message}");
            }
        }
    }
}