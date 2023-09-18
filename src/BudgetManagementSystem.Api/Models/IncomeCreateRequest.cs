namespace BudgetManagementSystem.Api.Models
{
    public class IncomeCreateRequest
    {
        public string? Title { get; set; }
        public IncomeCategories Category { get; set; }
        public double Amount { get; set; }
        public string? Description { get; set; }
        public DateTime Time { get; set; }
    }
}
