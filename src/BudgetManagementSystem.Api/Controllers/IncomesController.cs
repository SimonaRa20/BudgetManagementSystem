using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Incomes;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/Families/{familyId}/Members/{memberId}/[controller]")]
    [ApiController]
    public class IncomesController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public IncomesController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetIncomes(int familyId, int memberId)
        {
            try
            {
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == memberId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var incomes = await _dbContext.Incomes
                    .Where(i => i.FamilyMemberId == memberId)
                    .ToListAsync();

                var incomeResponses = incomes.Select(i => new IncomeResponse
                {
                    Id = i.Id,
                    Title = i.Title,
                    Category = i.Category,
                    Amount = i.Amount,
                    Description = i.Description,
                    Time = i.Time
                }).ToList();

                return Ok(incomeResponses);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching incomes: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> CreateIncome(int familyId, int memberId, IncomeCreateRequest incomeRequest)
        {
            try
            {
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == memberId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var errors = new List<string>();

                if (string.IsNullOrWhiteSpace(incomeRequest.Title))
                {
                    errors.Add("Title is required.");
                }

                if (!Enum.IsDefined(typeof(IncomeCategories), incomeRequest.Category))
                {
                    errors.Add("Invalid category.");
                }

                if (incomeRequest.Amount <= 0)
                {
                    errors.Add("Amount must be greater than zero.");
                }

                if (string.IsNullOrWhiteSpace(incomeRequest.Description))
                {
                    errors.Add("Description is required.");
                }

                if (incomeRequest.Time == default)
                {
                    errors.Add("Time is required.");
                }

                if (errors.Count > 0)
                {
                    return new ObjectResult(errors)
                    {
                        StatusCode = (int)HttpStatusCode.UnprocessableEntity
                    };
                }

                var income = new IncomeDto
                {
                    Title = incomeRequest.Title,
                    Category = incomeRequest.Category,
                    Amount = incomeRequest.Amount,
                    Description = incomeRequest.Description,
                    Time = incomeRequest.Time,
                    FamilyMemberId = memberId,
                };

                _dbContext.Incomes.Add(income);
                await _dbContext.SaveChangesAsync();

                var incomeResponse = new IncomeResponse
                {
                    Id = income.Id,
                    Title = income.Title,
                    Category = income.Category,
                    Amount = income.Amount,
                    Description = income.Description,
                    Time = income.Time
                };

                return Created("", incomeResponse);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while creating the income: {ex.Message}");
            }
        }

        [HttpGet("{incomeId}")]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetIncomeById(int familyId, int memberId, int incomeId)
        {
            try
            {
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == memberId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var income = await _dbContext.Incomes.FirstOrDefaultAsync(i => i.Id == incomeId && i.FamilyMemberId == memberId);
                if (income == null)
                {
                    return NotFound("Income not found.");
                }

                var incomeResponse = new IncomeResponse
                {
                    Id = income.Id,
                    Title = income.Title,
                    Category = income.Category,
                    Amount = income.Amount,
                    Description = income.Description,
                    Time = income.Time
                };

                return Ok(incomeResponse);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the income: {ex.Message}");
            }
        }
        [HttpPut("{incomeId}")]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> UpdateIncome(int familyId, int memberId, int incomeId, IncomeCreateRequest incomeUpdate)
        {
            try
            {
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == memberId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var income = await _dbContext.Incomes.FirstOrDefaultAsync(i => i.Id == incomeId && i.FamilyMemberId == memberId);
                if (income == null)
                {
                    return NotFound("Income not found.");
                }

                var errors = new List<string>();

                if (string.IsNullOrWhiteSpace(incomeUpdate.Title))
                {
                    errors.Add("Title is required.");
                }

                if (!Enum.IsDefined(typeof(IncomeCategories), incomeUpdate.Category))
                {
                    errors.Add("Invalid category.");
                }

                if (incomeUpdate.Amount <= 0)
                {
                    errors.Add("Amount must be greater than zero.");
                }

                if (string.IsNullOrWhiteSpace(incomeUpdate.Description))
                {
                    errors.Add("Description is required.");
                }

                if (incomeUpdate.Time == default)
                {
                    errors.Add("Time is required.");
                }

                if (errors.Count > 0)
                {
                    return new ObjectResult(errors)
                    {
                        StatusCode = (int)HttpStatusCode.UnprocessableEntity
                    };
                }

                income.Title = incomeUpdate.Title;
                income.Category = incomeUpdate.Category;
                income.Amount = incomeUpdate.Amount;
                income.Description = incomeUpdate.Description;
                income.Time = incomeUpdate.Time;

                await _dbContext.SaveChangesAsync();

                var incomeResponse = new IncomeResponse
                {
                    Id = income.Id,
                    Title = income.Title,
                    Category = income.Category,
                    Amount = income.Amount,
                    Description = income.Description,
                    Time = income.Time
                };

                return Ok(incomeResponse);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating the income: {ex.Message}");
            }
        }

        [HttpDelete("{incomeId}")]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> DeleteIncome(int familyId, int memberId, int incomeId)
        {
            try
            {
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == memberId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var income = await _dbContext.Incomes.FirstOrDefaultAsync(i => i.Id == incomeId && i.FamilyMemberId == memberId);
                if (income == null)
                {
                    return NotFound("Income not found.");
                }

                _dbContext.Incomes.Remove(income);
                await _dbContext.SaveChangesAsync();

                return Ok("Income deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while deleting the income: {ex.Message}");
            }
        }
    }
}
