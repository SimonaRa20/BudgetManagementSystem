namespace BudgetManagementSystem.Api.Models
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public IncomeCategories Category { get; set; }
        public double Amount { get; set; }
        public string? Description { get; set; }
        public DateTime Time { get; set; }

        // Foreign key to represent the user who incurred the expense
        public int UserId { get; set; }
        public UserDto User { get; set; }
    }
}
