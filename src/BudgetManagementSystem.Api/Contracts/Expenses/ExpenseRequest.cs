using BudgetManagementSystem.Api.Constants;

namespace BudgetManagementSystem.Api.Contracts.Expenses
{
    public class ExpenseRequest
    {
        public string? Title { get; set; }
        public ExpenseCategories Category { get; set; }
        public double Amount { get; set; }
        public string? Description { get; set; }
        public DateTime Time { get; set; }
    }
}
