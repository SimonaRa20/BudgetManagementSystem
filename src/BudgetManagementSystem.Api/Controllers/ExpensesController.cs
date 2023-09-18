using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/Families/{familyId}/Users/{userId}/[controller]")]
    [ApiController]
    public class ExpensesController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public ExpensesController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetExpenses(int familyId, int userId)
        {
            try
            {
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var expenses = await _dbContext.Expenses
                    .Where(i => i.UserId == userId)
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
        public async Task<IActionResult> CreateExpense(int familyId, int userId, ExpenseCreateRequest expenseRequest)
        {
            try
            {
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var expense = new ExpenseDto
                {
                    Title = expenseRequest.Title,
                    Category = expenseRequest.Category,
                    Amount = expenseRequest.Amount,
                    Description = expenseRequest.Description,
                    Time = expenseRequest.Time,
                    UserId = userId,
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

                return Ok(expenseResponses);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while creating the expense: {ex.Message}");
            }
        }

        [HttpGet("{expenseId}")]
        public async Task<IActionResult> GetExpenseById(int familyId, int userId, int expenseId)
        {
            try
            {
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var expense = await _dbContext.Expenses.FirstOrDefaultAsync(i => i.Id == expenseId && i.UserId == userId);
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
    }
}
