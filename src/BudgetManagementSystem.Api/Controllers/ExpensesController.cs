using BudgetManagementSystem.Api.Constants;
using BudgetManagementSystem.Api.Contracts.Expenses;
using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/Families/{familyId}/Members/{memberId}/[controller]")]
    [ApiController]
    public class ExpensesController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public ExpensesController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetExpenses(int familyId, int memberId)
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

                var member = await _dbContext.FamilyMembers.FirstOrDefaultAsync(u => u.Id == memberId);
                if (member == null)
                {
                    return NotFound("Member not found.");
                }

                var expenses = await _dbContext.Expenses
                    .Where(i => i.FamilyMemberId == memberId)
                    .ToListAsync();

                var expenseResponses = expenses.Select(i => new ExpenseResponse
                {
                    Id = i.Id,
                    Title = i.Title,
                    Category = i.Category,
                    Amount = i.Amount,
                    Description = i.Description,
                    Time = i.Time
                }).ToList();

                return Ok(expenseResponses);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching expenses: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> CreateExpense(int familyId, int memberId, ExpenseRequest expenseRequest)
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

                var member = await _dbContext.FamilyMembers.FirstOrDefaultAsync(u => u.Id == memberId);
                if (member == null)
                {
                    return NotFound("Member not found.");
                }

                var errors = new List<string>();

                if (string.IsNullOrWhiteSpace(expenseRequest.Title))
                {
                    errors.Add("Title is required.");
                }

                if (!Enum.IsDefined(typeof(ExpenseCategories), expenseRequest.Category))
                {
                    errors.Add("Invalid category.");
                }

                if (expenseRequest.Amount <= 0)
                {
                    errors.Add("Amount must be greater than zero.");
                }

                if (string.IsNullOrWhiteSpace(expenseRequest.Description))
                {
                    errors.Add("Description is required.");
                }

                if (expenseRequest.Time == default)
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

                var expense = new ExpenseDto
                {
                    Title = expenseRequest.Title,
                    Category = expenseRequest.Category,
                    Amount = expenseRequest.Amount,
                    Description = expenseRequest.Description,
                    Time = expenseRequest.Time,
                    FamilyMemberId = memberId,
                };

                _dbContext.Expenses.Add(expense);
                await _dbContext.SaveChangesAsync();

                var expenseResponses = new ExpenseResponse
                {
                    Id = expense.Id,
                    Title = expense.Title,
                    Category = expense.Category,
                    Amount = expense.Amount,
                    Description = expense.Description,
                    Time = expense.Time
                };

                return Created("", expenseResponses);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while creating the expense: {ex.Message}");
            }
        }


        [HttpGet("{expenseId}")]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> GetExpenseById(int familyId, int memberId, int expenseId)
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

                var member = await _dbContext.FamilyMembers.FirstOrDefaultAsync(u => u.Id == memberId);
                if (member == null)
                {
                    return NotFound("Member not found.");
                }

                var expense = await _dbContext.Expenses.FirstOrDefaultAsync(i => i.Id == expenseId && i.FamilyMemberId == memberId);
                if (expense == null)
                {
                    return NotFound("Expense not found.");
                }

                var expenseResponse = new ExpenseResponse
                {
                    Id = expense.Id,
                    Title = expense.Title,
                    Category = expense.Category,
                    Amount = expense.Amount,
                    Description = expense.Description,
                    Time = expense.Time
                };

                return Ok(expenseResponse);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the expense: {ex.Message}");
            }
        }

        [HttpPut("{expenseId}")]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> UpdateExpense(int familyId, int memberId, int expenseId, ExpenseRequest expenseUpdate)
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

                var member = await _dbContext.FamilyMembers.FirstOrDefaultAsync(u => u.Id == memberId);
                if (member == null)
                {
                    return NotFound("Member not found.");
                }

                var expense = await _dbContext.Expenses.FirstOrDefaultAsync(i => i.Id == expenseId && i.FamilyMemberId == memberId);
                if (expense == null)
                {
                    return NotFound("Expense not found.");
                }

                var errors = new List<string>();

                if (string.IsNullOrWhiteSpace(expenseUpdate.Title))
                {
                    errors.Add("Title is required.");
                }

                if (!Enum.IsDefined(typeof(ExpenseCategories), expenseUpdate.Category))
                {
                    errors.Add("Invalid category.");
                }

                if (expenseUpdate.Amount <= 0)
                {
                    errors.Add("Amount must be greater than zero.");
                }

                if (string.IsNullOrWhiteSpace(expenseUpdate.Description))
                {
                    errors.Add("Description is required.");
                }

                if (expenseUpdate.Time == default)
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

                expense.Title = expenseUpdate.Title;
                expense.Category = expenseUpdate.Category;
                expense.Amount = expenseUpdate.Amount;
                expense.Description = expenseUpdate.Description;
                expense.Time = expenseUpdate.Time;

                await _dbContext.SaveChangesAsync();

                var expenseResponse = new ExpenseResponse
                {
                    Id = expense.Id,
                    Title = expense.Title,
                    Category = expense.Category,
                    Amount = expense.Amount,
                    Description = expense.Description,
                    Time = expense.Time
                };

                return Ok(expenseResponse);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while updating the expense: {ex.Message}");
            }
        }

        [HttpDelete("{expenseId}")]
        [Authorize(Roles = Role.Owner)]
        public async Task<IActionResult> DeleteExpense(int familyId, int memberId, int expenseId)
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

                var member = await _dbContext.FamilyMembers.FirstOrDefaultAsync(u => u.Id == memberId);
                if (member == null)
                {
                    return NotFound("Member not found.");
                }

                var expense = await _dbContext.Expenses.FirstOrDefaultAsync(i => i.Id == expenseId && i.FamilyMemberId == memberId);
                if (expense == null)
                {
                    return NotFound("Expense not found.");
                }

                _dbContext.Expenses.Remove(expense);
                await _dbContext.SaveChangesAsync();

                return Ok("Expense deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while deleting the expense: {ex.Message}");
            }
        }
    }
}
