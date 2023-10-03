using BudgetManagementSystem.Api.Contracts.Members;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

                var userUpdates = members.Select(u => new UserUpdate
                {
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

        [HttpDelete("{userId}")]
        //[Authorize]
        public async Task<IActionResult> DeleteMemberFromFamily(int familyId, int userId)
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

                var userToDelete = family.FamilyMembers.FirstOrDefault(u => u.Id == userId);

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

        [HttpPut("{userId}")]
        //[Authorize]
        public async Task<IActionResult> UpdateUserInFamily(int familyId, int userId, UserUpdate updateRequest)
        {
            try
            {
                List<string> errors = new List<string>();

                var family = await _dbContext.Families
                    .Include(f => f.FamilyMembers)
                    .FirstOrDefaultAsync(f => f.Id == familyId);

                if (family == null)
                {
                    errors.Add("Family not found.");
                }

                var userToUpdate = family.FamilyMembers.FirstOrDefault(u => u.Id == userId);

                if (userToUpdate == null)
                {
                    errors.Add("User not found in this family.");
                }

                if (updateRequest.Email.IsNullOrEmpty() || !updateRequest.Email.Contains('@'))
                {
                    errors.Add("Invalid email format.");
                }

                if (string.IsNullOrWhiteSpace(updateRequest.Name))
                {
                    errors.Add("User name is necessary.");
                }

                if (string.IsNullOrWhiteSpace(updateRequest.Surname))
                {
                    errors.Add("User surname is necessary.");
                }

                if (_dbContext.Users.Any(u => u.Email == updateRequest.Email))
                {
                    errors.Add("User with the same email already exists.");
                }

                if (errors.Count > 0)
                {
                    return BadRequest(errors);
                }

                if (!string.IsNullOrWhiteSpace(updateRequest.Name))
                {
                    userToUpdate.Name = updateRequest.Name;
                }

                if (!string.IsNullOrWhiteSpace(updateRequest.Surname))
                {
                    userToUpdate.Surname = updateRequest.Surname;
                }

                if (!string.IsNullOrWhiteSpace(updateRequest.UserName))
                {
                    userToUpdate.UserName = updateRequest.UserName;
                }

                if (!string.IsNullOrWhiteSpace(updateRequest.Email))
                {
                    userToUpdate.Email = updateRequest.Email;
                }

                await _dbContext.SaveChangesAsync();

                return Ok("User updated in the family successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating the user: {ex.Message}");
            }
        }

    }
}
