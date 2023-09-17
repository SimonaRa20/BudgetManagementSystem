using Microsoft.EntityFrameworkCore.Metadata;

namespace BudgetManagementSystem.Api.Models
{
    public class UserDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? UserName { get; set; }
        public string? Role { get; set; }
        public string? Email { get; set; }
        public string? HashedPassword { get; set; }

        // Foreign key to represent the family the user belongs to
        public int? FamilyId { get; set; }
        public FamilyDto? Family { get; set; }

        // Navigation properties for user's incomes and expenses
        public ICollection<IncomeDto>? Incomes { get; set; }
        public ICollection<ExpenseDto>? Expenses { get; set; }
    }
}
