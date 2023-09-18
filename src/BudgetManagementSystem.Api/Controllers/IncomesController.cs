using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetManagementSystem.Api.Controllers
{
    [Route("api/Families/{familyId}/Users/{userId}/[controller]")]
    [ApiController]
    public class IncomesController : Controller
    {
        private readonly BudgetManagementSystemDbContext _dbContext;

        public IncomesController(BudgetManagementSystemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetIncomes(int familyId, int userId)
        {
            try
            {
                // Check if the family with the specified ID exists
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                // Check if the user with the specified ID exists
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Retrieve incomes associated with the user
                var incomes = await _dbContext.Incomes
                    .Where(i => i.UserId == userId)
                    .ToListAsync();

                return Ok(incomes);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching incomes: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateIncome(int familyId, int userId, IncomeCreateRequest incomeRequest)
        {
            try
            {
                // Check if the family with the specified ID exists
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                // Check if the user with the specified ID exists
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Create a new income
                var income = new IncomeDto
                {
                    Title = incomeRequest.Title,
                    Category = incomeRequest.Category,
                    Amount = incomeRequest.Amount,
                    Description = incomeRequest.Description,
                    Time = incomeRequest.Time,
                    UserId = userId,
                };

                _dbContext.Incomes.Add(income);
                await _dbContext.SaveChangesAsync();

                return Ok(income);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while creating the income: {ex.Message}");
            }
        }

        [HttpGet("{incomeId}")]
        public async Task<IActionResult> GetIncomeById(int familyId, int userId, int incomeId)
        {
            try
            {
                // Check if the family with the specified ID exists
                var family = await _dbContext.Families.FirstOrDefaultAsync(f => f.Id == familyId);
                if (family == null)
                {
                    return NotFound("Family not found.");
                }

                // Check if the user with the specified ID exists
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Retrieve the income by ID and ensure it belongs to the user
                var income = await _dbContext.Incomes.FirstOrDefaultAsync(i => i.Id == incomeId && i.UserId == userId);
                if (income == null)
                {
                    return NotFound("Income not found.");
                }

                return Ok(income);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the income: {ex.Message}");
            }
        }

    }
}
