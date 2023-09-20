using BudgetManagementSystem.Api.Database;
using BudgetManagementSystem.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                    .Where(i => i.UserId == memberId)
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

                var income = new IncomeDto
                {
                    Title = incomeRequest.Title,
                    Category = incomeRequest.Category,
                    Amount = incomeRequest.Amount,
                    Description = incomeRequest.Description,
                    Time = incomeRequest.Time,
                    UserId = memberId,
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

                return Ok(incomeResponse);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while creating the income: {ex.Message}");
            }
        }

        [HttpGet("{incomeId}")]
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

                var income = await _dbContext.Incomes.FirstOrDefaultAsync(i => i.Id == incomeId && i.UserId == userId);
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


    }
}
