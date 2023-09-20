using BudgetManagementSystem.Api.Constants;

namespace BudgetManagementSystem.Api.Contracts.Incomes
{
    public class IncomeResponse
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public IncomeCategories Category { get; set; }
        public double Amount { get; set; }
        public string? Description { get; set; }
        public DateTime Time { get; set; }
    }
}
