using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Auth;
using BudgetManagementSystem.Api.Contracts.Families;
using BudgetManagementSystem.Api.Contracts.Members;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;
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
                var loggedUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == familyId);

                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var isLoggedUserFamilyMember = family.FamilyMembers.Any(fm => fm.UserId == loggedUserId);

                if (!isLoggedUserFamilyMember)
                {
                    return Forbid();
                }

                var familyMembers = await _dbContext.FamilyMembers
                    .Where(fm => fm.FamilyId == familyId)
                    .Include(fm => fm.User)
                    .Select(fm => new FamilyMemberResponse
                    {
                        FamilyMemberId = fm.Id,
                        FamilyId = familyId,
                        Name = fm.User.Name,
                        Surname = fm.User.Surname,
                        UserName = fm.User.UserName,
                        Email = fm.User.Email,
                        Type = fm.Type
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
                var loggedUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                var family = await _dbContext.Families
                   .Include(f => f.FamilyMembers)
                   .FirstOrDefaultAsync(f => f.Id == familyId);

                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var isLoggedUserFamilyMember = family.FamilyMembers.Any(fm => fm.UserId == loggedUserId);

                if (!isLoggedUserFamilyMember)
                {
                    return Forbid();
                }

                var familyMember = await _dbContext.FamilyMembers
                    .Where(fm => fm.FamilyId == familyId && fm.Id == memberId)
                    .Include(fm => fm.User)
                    .FirstOrDefaultAsync();

                if (familyMember == null)
                {
                    return NotFound("Family member not found.");
                }

                var member = new FamilyMemberResponse
                {
                    FamilyMemberId = familyMember.Id,
                    FamilyId = familyMember.FamilyId,
                    Name = familyMember.User.Name,
                    Surname = familyMember.User.Surname,
                    UserName = familyMember.User.UserName,
                    Email = familyMember.User.Email,
                    Type = familyMember.Type
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
                var loggedUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == familyId);

                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var isLoggedUserFamilyMember = family.FamilyMembers.Any(fm => fm.UserId == loggedUserId);

                if (!isLoggedUserFamilyMember)
                {
                    return Forbid();
                }

                var userToDelete = family.FamilyMembers.FirstOrDefault(u => u.Id == memberId);

                if (userToDelete == null)
                {
                    return NotFound("User not found in this family.");
                }

                var expensesToDelete = _dbContext.Expenses
                    .Where(e => e.FamilyMemberId == userToDelete.Id);

                _dbContext.Expenses.RemoveRange(expensesToDelete);

                var incomesToDelete = _dbContext.Incomes
                    .Where(i => i.FamilyMemberId == userToDelete.Id);

                _dbContext.Incomes.RemoveRange(incomesToDelete);

                family.FamilyMembers.Remove(userToDelete);

                if (family.FamilyMembers.Count == 0)
                {
                    _dbContext.Families.Remove(family);
                }

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
        public async Task<IActionResult> UpdateMemberInFamily(int familyId, int memberId, [FromBody] MemberType type)
        {
            try
            {
                var loggedUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

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

                var isLoggedUserFamilyMember = family.FamilyMembers.Any(fm => fm.UserId == loggedUserId);

                if (!isLoggedUserFamilyMember)
                {
                    return Forbid();
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
        public async Task<IActionResult> AddMemberToFamily([FromBody] int userId, int familyId)
        {
            try
            {
                var loggedUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                if (userId <= 0)
                {
                    return BadRequest("Invalid user id.");
                }

                var existingFamily = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .ThenInclude(fm => fm.User)
                    .FirstOrDefaultAsync(f => f.Id == familyId);

                if (existingFamily == null)
                {
                    return NotFound("Family not found.");
                }

                var isLoggedUserFamilyMember = existingFamily.FamilyMembers.Any(fm => fm.UserId == loggedUserId);

                if (!isLoggedUserFamilyMember)
                {
                    return Forbid();
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return BadRequest("User not found.");
                }

                var isUserAlreadyInFamily = existingFamily.FamilyMembers.Any(fm => fm.UserId == userId);

                if (isUserAlreadyInFamily)
                {
                    return new ObjectResult("This user is already a member of the family.")
                    {
                        StatusCode = (int)HttpStatusCode.UnprocessableEntity
                    };
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

                var response = new FamilyByIdResponse
                {
                    Id = existingFamily.Id,
                    Title = existingFamily.Title,
                    Members = existingFamily.FamilyMembers.Select(fm => new FamilyMemberResponse
                    {
                        FamilyMemberId = fm.Id,
                        FamilyId = fm.FamilyId,
                        Name = fm.User.Name,
                        Surname = fm.User.Surname,
                        UserName = fm.User.UserName,
                        Email = fm.User.Email,
                    }).ToList()
                };

                return Created("", response);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating the family: {ex.Message}");
            }
        }

        [HttpGet("NotInFamily")]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetUsersNotInFamily(int familyId)
        {
            try
            {
                var loggedUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == familyId);

                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var isLoggedUserFamilyMember = family.FamilyMembers.Any(fm => fm.UserId == loggedUserId);

                if (!isLoggedUserFamilyMember)
                {
                    return Forbid();
                }

                // Step 1: Get user IDs already in the family
                var userIdsInFamily = family.FamilyMembers.Select(fm => fm.UserId);

                // Step 2: Query users whose IDs are not in the family and have the 'Owner' role
                var usersNotInFamily = await _dbContext.Users
                    .Where(u => !userIdsInFamily.Contains(u.Id) && u.Role == Role.Owner)
                    .Select(u => new UserResponse
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Surname = u.Surname,
                        UserName = u.UserName,
                        Email = u.Email
                    })
                    .ToListAsync();

                return Ok(usersNotInFamily);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching users not in the family: {ex.Message}");
            }
        }


    }
}
