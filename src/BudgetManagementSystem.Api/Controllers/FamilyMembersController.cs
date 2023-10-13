using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Families;
using BudgetManagementSystem.Api.Contracts.Members;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/Families/{familyId}/[controller]")]
    [ApiController]
    public class FamilyMembersController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public FamilyMembersController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        //[Authorize]
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

               
                return Ok(members);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching users: {ex.Message}");
            }
        }
        [HttpGet("{memberId}")]
        //[Authorize]
        public async Task<IActionResult> GetMemberByFamilyId(int familyId, int memberId)
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

                var member = members.FirstOrDefault(x => x.Id == memberId);

                return Ok(member);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching users: {ex.Message}");
            }
        }
        [HttpDelete("{memberId}")]
        //[Authorize]
        public async Task<IActionResult> DeleteMemberFromFamily(int familyId, int memberId)
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

                var userToDelete = family.FamilyMembers.FirstOrDefault(u => u.Id == memberId);

                if (userToDelete == null)
                {
                    return NotFound("User not found in this family.");
                }

                family.FamilyMembers.Remove(userToDelete);

                await _dbContext.SaveChangesAsync();

                return Ok("User deleted from the family successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while deleting the user: {ex.Message}");
            }
        }

        [HttpPut("{memberId}")]
        //[Authorize]
        public async Task<IActionResult> UpdateUserInFamily(int familyId, int memberId, [FromBody] MemberType type)
        {
            try
            {
                List<string> errors = new List<string>();

                // Check if the provided type is valid
                if (!Enum.IsDefined(typeof(MemberType), type))
                {
                    errors.Add("Invalid member type.");
                }

                // Retrieve the family
                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == familyId);

                if (family == null)
                {
                    errors.Add("Family not found.");
                }

                // Find the user to update
                var userToUpdate = family.FamilyMembers.FirstOrDefault(u => u.Id == memberId);

                if (userToUpdate == null)
                {
                    errors.Add("User not found in this family.");
                }

                if (errors.Count > 0)
                {
                    return new ObjectResult(errors)
                    {
                        StatusCode = (int)HttpStatusCode.UnprocessableEntity
                    };
                }

                userToUpdate.Type = type;

                // Save the changes to the database
                await _dbContext.SaveChangesAsync();

                return Ok("User updated in the family successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating the user: {ex.Message}");
            }
        }

        [HttpPost("{memberId}")]
        //[Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> AddMemberToFamily(int memberId, int familyId)
        {
            try
            {
                if (memberId <= 0)
                {
                    return BadRequest("Invalid user id.");
                }

                var existingFamily = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);

                if (existingFamily == null)
                {
                    return BadRequest("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == memberId);

                if (user == null)
                {
                    return BadRequest("User not found.");
                }

                var familyMember = new FamilyMemberDto
                {
                    FamilyId = familyId,
                    UserId = memberId,
                    Type = MemberType.Other,
                    User = user
                };

                _dbContext.FamilyMembers.Add(familyMember);

                await _dbContext.SaveChangesAsync();

                existingFamily.FamilyMembers.Add(familyMember);

                return Ok(existingFamily);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating the family: {ex.Message}");
            }
        }
    }
}
