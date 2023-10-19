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
        [Authorize(Roles = Role.Owner)]
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

                var familyMembers = await _dbContext.FamilyMembers
                    .Where(fm => fm.FamilyId == familyId)
                    .Include(fm => fm.User)
                    .Select(fm => new Member
                    {
                        FamilyMemberId = fm.Id,
                        Name = fm.User.Name,
                        Surname = fm.User.Surname,
                        UserName = fm.User.UserName,
                        Email = fm.User.Email
                    })
                    .ToListAsync();

                return Ok(familyMembers);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching members: {ex.Message}");
            }
        }

        [HttpGet("{memberId}")]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetMemberByFamilyId(int familyId, int memberId)
        {
            try
            {
                var familyMember = await _dbContext.FamilyMembers
                    .Where(fm => fm.FamilyId == familyId && fm.Id == memberId)
                    .Include(fm => fm.User)
                    .FirstOrDefaultAsync();

                if (familyMember == null)
                {
                    return NotFound("Family member not found.");
                }

                var member = new Member
                {
                    FamilyMemberId = familyMember.Id,
                    Name = familyMember.User.Name,
                    Surname = familyMember.User.Surname,
                    UserName = familyMember.User.UserName,
                    Email = familyMember.User.Email
                };

                return Ok(member);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the member: {ex.Message}");
            }
        }

        [HttpDelete("{memberId}")]
        [Authorize(Roles = Role.Owner)]
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
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> UpdateUserInFamily(int familyId, int memberId, [FromBody] MemberType type)
        {
            try
            {
                List<string> errors = new List<string>();

                if (!Enum.IsDefined(typeof(MemberType), type))
                {
                    errors.Add("Invalid member type.");
                }

                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == familyId);

                if (family == null)
                {
                    errors.Add("Family not found.");
                }

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
                await _dbContext.SaveChangesAsync();

                return Ok("User updated in the family successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating the user: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> AddMemberToFamily([FromBody]int userId, int familyId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest("Invalid user id.");
                }

                var existingFamily = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);

                if (existingFamily == null)
                {
                    return BadRequest("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return BadRequest("User not found.");
                }

                var familyMember = new FamilyMemberDto
                {
                    FamilyId = familyId,
                    UserId = userId,
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
