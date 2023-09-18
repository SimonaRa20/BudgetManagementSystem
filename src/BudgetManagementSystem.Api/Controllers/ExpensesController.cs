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

                return Ok(expenses);
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

                var income = new ExpenseDto
                {
                    Title = expenseRequest.Title,
                    Category = expenseRequest.Category,
                    Amount = expenseRequest.Amount,
                    Description = expenseRequest.Description,
                    Time = expenseRequest.Time,
                    UserId = userId,
                };

                _dbContext.Expenses.Add(income);
                await _dbContext.SaveChangesAsync();

                return Ok(income);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while creating the expense: {ex.Message}");
            }
        }

        [HttpGet("{incomeId}")]
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

                return Ok(expense);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the expense: {ex.Message}");
            }
        }
    }
}
