namespace BudgetManagementSystem.Api.Models
{
    public class ExpenseCreateRequest
    {
        public string? Title { get; set; }
        public ExpenseCategories Category { get; set; }
        public double Amount { get; set; }
        public string? Description { get; set; }
        public DateTime Time { get; set; }
    }
}
